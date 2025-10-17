import { getNeo4jSession } from "./neo4j";

export async function createFollowRelation(
  followerId: string,
  followeeId: string
) {
  const session = await getNeo4jSession();
  try {
    await session.run(
      `
      MATCH (a:User {id: $followerId}), (b:User {id: $followeeId})
      MERGE (a)-[:FOLLOWS]->(b)
      `,
      { followerId, followeeId }
    );
  } finally {
    await session.close();
  }
}

export async function deleteFollowRelation(
  followerId: string,
  followeeId: string
) {
  const session = await getNeo4jSession();
  try {
    await session.run(
      `
      MATCH (a:User {id: $followerId})-[r:FOLLOWS]->(b:User {id: $followeeId})
      DELETE r
      `,
      { followerId, followeeId }
    );
  } finally {
    await session.close();
  }
}

export async function checkIfFollowing(viewerId: string, targetId: string) {
  const session = await getNeo4jSession();
  try {
    const result = await session.run(
      `
      MATCH (a:User {id: $viewerId})-[r:FOLLOWS]->(b:User {id: $targetId})
      RETURN COUNT(r) > 0 AS isFollowing
      `,
      { viewerId, targetId }
    );
    return result.records[0].get("isFollowing");
  } finally {
    await session.close();
  }
}

export async function getDistanceBetweenUsers(userA: string, userB: string) {
  const session = await getNeo4jSession();
  try {
    const result = await session.run(
      `
      MATCH (a:User {id: $userA}), (b:User {id: $userB}),
      p = shortestPath((a)-[:FOLLOWS*]-(b))
      RETURN length(p) AS distance
      `,
      { userA, userB }
    );

    const distance = result.records[0]?.get("distance");
    return distance ?? null;
  } finally {
    await session.close();
  }
}

export async function checkMutualFollow(userA: string, userB: string) {
  const session = await getNeo4jSession();
  try {
    const result = await session.run(
      `
      MATCH (a:User {id: $userA})-[:FOLLOWS]->(b:User {id: $userB}),
            (b)-[:FOLLOWS]->(a)
      RETURN COUNT(*) > 0 AS isFriend
      `,
      { userA, userB }
    );

    return result.records[0].get("isFriend");
  } finally {
    await session.close();
  }
}
export async function getRelationshipStatus(userA: string, userB: string) {
  const session = await getNeo4jSession();
  try {
    const result = await session.run(
      `
      MATCH (a:User {id: $userA}), (b:User {id: $userB})
      OPTIONAL MATCH (a)-[r1:FOLLOWS]->(b)
      OPTIONAL MATCH (b)-[r2:FOLLOWS]->(a)
      RETURN 
        COUNT(r1) > 0 AS isFollowing,
        COUNT(r2) > 0 AS isFollowedBy,
        (COUNT(r1) > 0 AND COUNT(r2) > 0) AS isMutual
      `,
      { userA, userB }
    );

    const record = result.records[0];
    return {
      isFollowing: record.get("isFollowing"),
      isFollowedBy: record.get("isFollowedBy"),
      isMutual: record.get("isMutual"),
    };
  } finally {
    await session.close();
  }
}
