import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
 persist(
    (set) => ({
      count: 0,
      pending: false,


      currentModuleTopicPublished: false,


      currentAiModuleId: '',
      currentAiModuleTopicId: '',
      currentUserEnrolledAiModuleId: '',
      currentUserEnrolledAiModuleTopicId: '',

      currentAiModuleName: '',
      currentAiModuleTopicName: '',
      currentUserEnrolledAiModuleName: '',
      currentUserEnrolledAiModuleTopicName: '',


      currentModuleId: '',
      currentModuleTopicId: '',
      currentUserModuleId: '',
      currentUserModuleTopicId: '',
      currentUserEnrolledModuleId: '',
      currentUserEnrolledModuleTopicId: '',

      currentModuleName: '',
      currentModuleTopicName: '',
      currentUserModuleName: '',
      currentUserModuleTopicName: '',
      currentUserEnrolledModuleName: '',
      currentUserEnrolledModuleTopicName: '',


      currentUserModulePublished: false,

      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),


      setCurrentAiModuleId: (value) => set({ currentaiModuleId: value }),
      setCurrentAiModuleTopicId: (value) => set({ currentAiModuleTopicId: value }),
      setCurrentUserEnrolledAiModuleId: (value) => set({ currentUserEnrolledAiModuleId: value }),
      setCurrentUserEnrolledAiModuleTopicId: (value) => set({ currentUserEnrolledAiModuleTopicId: value }),

      setCurrentAiModuleName: (value) => set({ currentAiModuleName: value }),
      setCurrentAiModuleTopicName: (value) => set({ currentAiModuleTopicName: value }),
      setCurrentUserEnrolledAiModuleName: (value) => set({ currentUserEnrolledAiModuleName: value }),
      setCurrentUserEnrolledAiModuleTopicName: (value) => set({ currentUserEnrolledAiModuleTopicName: value }),


      setCurrentModuleId: (value) => set({ currentModuleId: value }),
      setCurrentModuleTopicId: (value) => set({ currentModuleTopicId: value }),
      setCurrentUserModuleId: (value) => set({ currentUserModuleId: value }),
      setCurrentUserModuleTopicId: (value) => set({ currentUserModuleTopicId: value }),
      setCurrentUserEnrolledModuleId: (value) => set({ currentUserEnrolledModuleId: value }),
      setCurrentUserEnrolledModuleTopicId: (value) => set({ currentUserEnrolledModuleTopicId: value }),

      setCurrentModuleName: (value) => set({ currentModuleName: value }),
      setCurrentModuleTopicName: (value) => set({ currentModuleTopicName: value }),
      setCurrentUserModuleName: (value) => set({ currentUserModuleName: value }),
      setCurrentUserModuleTopicName: (value) => set({ currentUserModuleTopicName: value }),
      setCurrentUserEnrolledModuleName: (value) => set({ currentUserEnrolledModuleName: value }),
      setCurrentUserEnrolledModuleTopicName: (value) => set({ currentUserEnrolledModuleTopicName: value }),

      setCurrentModuleTopicPublished: (value) => set({currentModuleTopicPublished: value}),

      setCurrentUserModulePublished: (value) => set({currentUserModulePublished: value}),

      setPending: (value) => set({ pending: value }),
    }),
    {
      name: "myStore", // Unique name for your store
      getStorage: () => localStorage, // Use localStorage for persistence
    }
 )
);

export default useStore;
