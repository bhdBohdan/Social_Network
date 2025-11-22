import { NextResponse } from "next/server";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient, TABLE_NAME } from "@/common/dynamoDB/dynamo.db"; // Імпортуємо клієнт

interface ReactionRequest {
  postId: string;
  commentSK: string;
  userId: string;
  type: string;
}

interface Reaction {
  user: string;
  type: string;
}

interface CommentItem {
  PK: string;
  SK: string;
  PostId: string;
  CommentId: string;
  Content: string;
  Reactions: Reaction[];
  ModifiedAt: string;
}

export async function POST(req: Request) {
  const { postId, commentSK, userId, type } =
    (await req.json()) as ReactionRequest;

  // 1. Валідація
  if (!postId || !commentSK || !userId) {
    return NextResponse.json(
      { message: "Missing postId, commentSK, or userId" },
      { status: 400 }
    );
  }

  const PK = `POST#${postId}`;
  const reactionType = type || "like";

  // --- Крок 1: GET (Отримати поточний елемент) ---
  const getCommand = new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK, SK: commentSK },
  });

  let currentComment: CommentItem | undefined;
  try {
    const getResponse = await ddbDocClient.send(getCommand);
    currentComment = getResponse.Item as CommentItem | undefined;
  } catch (error) {
    console.error("Помилка при отриманні коментаря:", error);
    return NextResponse.json(
      { message: "Database read error" },
      { status: 500 }
    );
  }

  if (!currentComment) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  // --- Крок 2: Toggle (Локальна модифікація) ---

  let newReactions = currentComment.Reactions || [];

  // Знаходимо, чи реакція користувача вже існує
  const existingIndex = newReactions.findIndex(
    (r: Reaction) => r.user === userId
  );

  if (existingIndex !== -1) {
    // toggle off: видаляємо існуючу реакцію
    newReactions.splice(existingIndex, 1);
  } else {
    // toggle on: додаємо нову реакцію
    newReactions.push({ user: userId, type: reactionType });
  }

  // Оновлюємо об'єкт для запису
  const now = new Date().toISOString();
  currentComment.Reactions = newReactions;
  currentComment.ModifiedAt = now; // Оновлюємо мітку часу модифікації

  // --- Крок 3: PUT (Записати оновлений елемент) ---

  const putCommand = new PutCommand({
    TableName: TABLE_NAME,
    Item: currentComment,
    // ConditionExpression для запобігання втраті даних
    // Перевіряємо, що ми не перезаписуємо елемент, який був змінений після нашого GET
    // Для цього потрібне поле версії (Version/ModifiedAt)
    // ConditionExpression: "ModifiedAt = :originalModifiedAt",
    // ExpressionAttributeValues: { ":originalModifiedAt": originalModifiedAt }
  });

  try {
    await ddbDocClient.send(putCommand);
  } catch (error) {
    console.error("Помилка при оновленні коментаря (Put):", error);
    // Якщо ви використовуєте оптимістичне блокування, тут буде ConditionalCheckFailedException
    return NextResponse.json(
      { message: "Failed to update reaction due to conflict" },
      { status: 500 }
    );
  }

  // Повертаємо оновлений коментар
  return NextResponse.json(currentComment);
}

// import { NextResponse } from "next/server";
// import dbConnect from "@/common/mongoDB/mongo.db";
// import Comment from "@/common/mongoDB/models/Comment"; // ✅ make sure you have this model
// import { Reaction } from "@/common/interfaces/Reaction";

// export async function POST(req: Request, context: any) {
//   await dbConnect();

//   const { id } = context.params;
//   const { userId, type } = await req.json();

//   if (!userId) {
//     return NextResponse.json({ message: "Missing userId" }, { status: 400 });
//   }

//   const comment = await Comment.findById(id);
//   if (!comment) {
//     return NextResponse.json({ message: "Not found" }, { status: 404 });
//   }

//   const existing = comment.reactions.find(
//     (r: Reaction) => r.user.toString() === userId
//   );

//   if (existing) {
//     // toggle
//     comment.reactions = comment.reactions.filter(
//       (r: Reaction) => r.user.toString() !== userId
//     );
//   } else {
//     comment.reactions.push({ user: userId, type: type || "like" });
//   }

//   await comment.save();
//   return NextResponse.json(comment);
// }
