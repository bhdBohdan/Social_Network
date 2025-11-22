import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME, ddbDocClient } from "./dynamo.db";
import { v4 as uuidv4 } from "uuid";

export interface Post {
  _id: string;
  content: string;
  author: string; // id
  reactions: { user: { _id: string }; type: string }[];
}

export interface Comment {
  _id?: string;
  content: string;
  post: string; // id
  author: string; // id
  reactions: { user: { _id: string }; type: string }[];
}

/**
 * Створює новий Пост у DynamoDB.
 * @param postData Дані нового поста.
 */
export async function createPost(postData: Post) {
  const postId = postData._id;

  const now = new Date().toISOString();

  const postItem = {
    PK: `POST#${postId}`,
    SK: `POST`,

    // Атрибути для GSI (якщо потрібно сортувати пости, наприклад, за часом створення)
    GSI1PK: `USER#${postData.author}`,
    GSI1SK: `POST#${now}`,

    Type: "POST",
    PostId: postId,
    Content: postData.content,
    AuthorId: postData.author,
    Reactions: postData.reactions,
    CreatedAt: now,
    ModifiedAt: now,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: postItem,
    ConditionExpression: "attribute_not_exists(PK)",
  });

  try {
    await ddbDocClient.send(command);
    console.log(`✅ Пост ${postId} успішно створено.`);
    return postItem;
  } catch (error) {
    console.error("❌ Помилка при створенні поста:", error);
    throw error;
  }
}

/**
 * Створює новий Коментар.
 * @param commentData Дані нового коментаря.
 */
export async function createComment(commentData: Comment) {
  const postId = commentData.post;
  const commentId = commentData._id || uuidv4();

  const now = new Date().toISOString();

  const commentSK = `COMMENT#${now}`;

  const commentItem = {
    PK: `POST#${postId}`,
    SK: commentSK,

    GSI1PK: `POST#${postId}`, // Може бути корисним для вибірки всіх коментарів для поста
    GSI1SK: `COMMENT#${now}`, // Для сортування коментарів за часом створення

    Type: "COMMENT",
    CommentId: commentId,
    Content: commentData.content,
    PostId: postId,
    Author: commentData.author,
    Reactions: commentData.reactions,

    CreatedAt: now,
    ModifiedAt: now,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: commentItem,
    ConditionExpression:
      "attribute_not_exists(PK) AND attribute_not_exists(SK)",
  });

  try {
    await ddbDocClient.send(command);
    console.log(
      `✅ Коментар ${commentId} до поста ${postId} успішно створено.`
    );
    return commentItem;
  } catch (error) {
    console.error("❌ Помилка при створенні коментаря:", error);
    throw error;
  }
}

/**
 * Оновлює вміст і дату модифікації існуючого Коментаря.
 * @param postId ID поста, до якого належить коментар.
 * @param commentSK SK коментаря (наприклад, "COMMENT#2025-11-22T08:00:00.000Z").
 * @param newContent Новий вміст коментаря.
 */
export async function updateComment(
  postId: string,
  commentSK: string,
  newContent: string
) {
  const PK = `POST#${postId}`;
  const now = new Date().toISOString();

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: PK, // PK: POST#<PostId>
      SK: commentSK, // SK: COMMENT#<CreatedDateTimeISO>
    },
    UpdateExpression: "SET Content = :newContent, ModifiedAt = :now",
    // Умова гарантує, що ми оновлюємо саме сутність "COMMENT"
    ConditionExpression: "attribute_exists(PK) AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues: {
      ":skPrefix": "COMMENT#",
      ":newContent": newContent,
      ":now": now,
    },
    ReturnValues: "ALL_NEW", // Повертає оновлений елемент
  });

  try {
    const response = await ddbDocClient.send(command);
    console.log(`✅ Коментар ${commentSK} успішно оновлено.`);
    return response.Attributes;
  } catch (error) {
    console.error("❌ Помилка при оновленні коментаря:", error);
    throw error;
  }
}

// Приклад використання:
/*
const updatedComment = await updateComment(
  "12345", // ID поста
  "COMMENT#2025-11-22T08:00:00.000Z", // SK коментаря, який потрібно оновити
  "Це оновлений і виправлений коментар!"
);
*/

/**
 * Отримує пост та всі його коментарі за ID поста.
 * @param postId ID поста.
 */
export async function getAllDataByPostId(postId: string) {
  const PK = `POST#${postId}`;

  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pkValue",
    ExpressionAttributeValues: {
      ":pkValue": PK,
    },
    ScanIndexForward: true,
  });

  try {
    const response = await ddbDocClient.send(command);

    const postItem = response.Items?.find((item) => item.SK === "POST");
    const comments = response.Items?.filter((item) =>
      item.SK.startsWith("COMMENT#")
    );

    console.log(`✅ Знайдено дані для поста ${postId}.`);

    return {
      post: postItem,
      comments: comments,
      count: response.Count,
    };
  } catch (error) {
    console.error(`❌ Помилка при отриманні даних для поста ${postId}:`, error);
    throw error;
  }
}

// Приклад використання:
/*
const postData = await getAllDataByPostId("12345");
if (postData.post) {
  console.log("Основний Пост:", postData.post.Content);
}
console.log("Коментарі:", postData.comments);
*/

/**
 * Видаляє існуючий Коментар з DynamoDB.
 * @param postId ID поста, до якого належить коментар.
 * @param commentSK SK коментаря (наприклад, "COMMENT#2025-11-22T08:00:00.000Z").
 */
async function deleteComment(postId: string, commentSK: string) {
  const PK = `POST#${postId}`;

  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: PK, // PK: POST#<PostId>
      SK: commentSK, // SK: COMMENT#<CreatedDateTimeISO>
    },
    // Рекомендовано додати ConditionExpression, щоб переконатися, що ви видаляєте саме коментар, а не пост
    ConditionExpression: "begins_with(SK, :skPrefix)",
    ExpressionAttributeValues: {
      ":skPrefix": "COMMENT#",
    },
    ReturnValues: "ALL_OLD", // Повертає видалений елемент (опціонально)
  });

  try {
    const response = await ddbDocClient.send(command);

    if (response.Attributes) {
      console.log(`✅ Коментар з SK ${commentSK} успішно видалено.`);
      return response.Attributes; // Повертає видалений елемент
    } else {
      console.log(`⚠️ Коментар з SK ${commentSK} не знайдено.`);
      return null;
    }
  } catch (error) {
    console.error("❌ Помилка при видаленні коментаря:", error);
    throw error;
  }
}

// Приклад використання:
/*
// Припустимо, ви знаєте SK коментаря, який хочете видалити
const deletedItem = await deleteComment(
  "12345", // ID поста
  "COMMENT#2025-11-22T08:00:00.000Z" // SK коментаря
);
*/
