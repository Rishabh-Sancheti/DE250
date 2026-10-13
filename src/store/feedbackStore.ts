import { create } from 'zustand';
import { FeedbackSubmission } from '../types';

interface FeedbackState {
  submissions: FeedbackSubmission[];
  addFeedback: (submission: FeedbackSubmission) => void;
  getFeedbackForOrder: (orderId: string) => FeedbackSubmission | undefined;
  getAverageRatings: () => {
    taste: number;
    quality: number;
    pickupTime: number;
    appEase: number;
    overall: number;
    totalCount: number;
  };
  resetFeedback: () => void;
}

const FEEDBACK_STORAGE_KEY = 'replate_feedback_v1';

const getInitialFeedback = (): FeedbackSubmission[] => {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load feedback', e);
  }

  return [
    {
      orderId: 'REP-5188',
      studentName: 'Vikram Singh',
      tasteRating: 5,
      qualityRating: 5,
      pickupTimeRating: 4,
      appEaseRating: 5,
      overallRating: 4.8,
      comments: 'Manchurian was hot and perfectly crispy! Saved me 20 minutes standing in line.',
      submittedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    },
  ];
};

export const useFeedbackStore = create<FeedbackState>((set, get) => {
  const initial = getInitialFeedback();

  const persist = (items: FeedbackSubmission[]) => {
    try {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist feedback', e);
    }
  };

  return {
    submissions: initial,

    addFeedback: (submission) => {
      const updated = [submission, ...get().submissions];
      set({ submissions: updated });
      persist(updated);
    },

    getFeedbackForOrder: (orderId: string) => {
      return get().submissions.find((f) => f.orderId === orderId);
    },

    getAverageRatings: () => {
      const subs = get().submissions;
      if (subs.length === 0) {
        return { taste: 5.0, quality: 5.0, pickupTime: 5.0, appEase: 5.0, overall: 5.0, totalCount: 0 };
      }

      const total = subs.length;
      const sumTaste = subs.reduce((acc, s) => acc + s.tasteRating, 0);
      const sumQuality = subs.reduce((acc, s) => acc + s.qualityRating, 0);
      const sumPickup = subs.reduce((acc, s) => acc + s.pickupTimeRating, 0);
      const sumEase = subs.reduce((acc, s) => acc + s.appEaseRating, 0);

      const taste = Number((sumTaste / total).toFixed(1));
      const quality = Number((sumQuality / total).toFixed(1));
      const pickupTime = Number((sumPickup / total).toFixed(1));
      const appEase = Number((sumEase / total).toFixed(1));
      const overall = Number(((taste + quality + pickupTime + appEase) / 4).toFixed(1));

      return { taste, quality, pickupTime, appEase, overall, totalCount: total };
    },

    resetFeedback: () => {
      const fresh = getInitialFeedback();
      set({ submissions: fresh });
      persist(fresh);
    },
  };
});
