// src/lib/cleanupPosts.ts
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Cleanup strategy:
 * - Keep posts from last 7 days
 * - Keep posts with 10+ likes (popular)
 * - Delete everything else older than 7 days with < 10 likes
 */
export async function cleanupOldPosts() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const postsRef = collection(db, 'posts');
    const oldPostsQuery = query(
      postsRef,
      where('createdAt', '<', Timestamp.fromDate(sevenDaysAgo))
    );
    
    const snapshot = await getDocs(oldPostsQuery);
    
    let deletedCount = 0;
    const deletePromises: Promise<void>[] = [];
    
    snapshot.forEach((postDoc) => {
      const data = postDoc.data();
      const likes = data.likes || 0;
      
      // Delete if less than 10 likes (not popular)
      if (likes < 10) {
        deletePromises.push(deleteDoc(doc(db, 'posts', postDoc.id)));
        deletedCount++;
      }
    });
    
    await Promise.all(deletePromises);
    
    console.log(`Cleanup complete: ${deletedCount} old posts deleted`);
    return deletedCount;
  } catch (error) {
    console.error('Error during cleanup:', error);
    return 0;
  }
}

/**
 * More aggressive cleanup if database is getting too full
 * - Keep only last 3 days
 * - Keep posts with 20+ likes
 */
export async function aggressiveCleanup() {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const postsRef = collection(db, 'posts');
    const oldPostsQuery = query(
      postsRef,
      where('createdAt', '<', Timestamp.fromDate(threeDaysAgo))
    );
    
    const snapshot = await getDocs(oldPostsQuery);
    
    let deletedCount = 0;
    const deletePromises: Promise<void>[] = [];
    
    snapshot.forEach((postDoc) => {
      const data = postDoc.data();
      const likes = data.likes || 0;
      
      // Delete if less than 20 likes
      if (likes < 20) {
        deletePromises.push(deleteDoc(doc(db, 'posts', postDoc.id)));
        deletedCount++;
      }
    });
    
    await Promise.all(deletePromises);
    
    console.log(`Aggressive cleanup complete: ${deletedCount} posts deleted`);
    return deletedCount;
  } catch (error) {
    console.error('Error during aggressive cleanup:', error);
    return 0;
  }
}
