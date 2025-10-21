import store from '@store/store';

export class MrUtils {
    /**
     * @deprecated This method is not compatible with React rendering.
     * Use the style properties on MergeRequest objects instead (styleColor, styleTags).
     * This method directly manipulates DOM which conflicts with React's virtual DOM.
     */
    static setMrStyle({ mrId }, { color, tags }) {
        const $mrLink = $(`ul.mr-list li.merge-request span.merge-request-title-text a[href="${mrId}"]`);

        $mrLink.css('color', color);

        const tagClass = 'mr-status-tags';

        $mrLink.find(`.${tagClass}`).remove();

        if (tags && tags.length) {
            const tag = tags.map(tag => `【${tag}】`).join('');
            $mrLink.prepend(`<span class="${tagClass}">${tag}</span>`);
        }
    }

    static isAllMyDiscussionUnresolved({ mrDetail: { mrDiscussions } }) {
        const userId = store.getState().user.id;
        if (!mrDiscussions) {
            return false;
        }

        // 所有本人参与且未解决的检视意见中，如果最后一条回复都是本人，则认为所有问题都未解决
        const myUnresolvedDiscussions = mrDiscussions
            .filter(({ resolvable, resolved }) => resolvable && !resolved)
            .filter(({ notes }) => notes.some(({ resolved, author: { username } }) => !resolved && username === userId));

        if (myUnresolvedDiscussions.length === 0) {
            return false;
        }

        return myUnresolvedDiscussions
            .map(({ notes }) => notes.reverse().find(({ resolved }) => !resolved))
            .every(({ author: { username } }) => username === userId);
    }
    static isMyApproved(mrInfo: any) {
        throw new Error("Method not implemented.");
    }
    static hasMergePermission(mrInfo: any): boolean {
        throw new Error("Method not implemented.");
    }
    static isMergeable({ mrDetail: { mergeable } }): boolean {
        return mergeable;
    }
    static isMyReviewed({ mrDetail: { watch_dog_review_service } }): boolean {
        if (!watch_dog_review_service) {
            return false;
        }

        const { approvers_check } = watch_dog_review_service;
        if (!approvers_check) {
            return false;
        }
        const userId = store.getState().user.id;
        return approvers_check.approved_by.includes(userId) || approvers_check.rejected_by.includes(userId);
    }
    static isRequiredReviewer({ mrDetail: { watch_dog_review_service } }): boolean {
        if (!watch_dog_review_service) {
            return false;
        }

        const { approvers_check } = watch_dog_review_service;
        if (!approvers_check) {
            return false;
        }
        const userId = store.getState().user.id;
        return approvers_check.required_approvers.includes(userId);
    }
    static hasOtherDiscussionUnresolved({ mrDetail: { mrDiscussions }}) {
        return false;
    }
    static isPipelineSuccess({ mrDetail: { pipeline_status } }): boolean {
        return pipeline_status === 'success';
    }
    static isPipelineRunning({ mrDetail: { pipeline_status } }) {
        return pipeline_status === 'running';
    }
    static hasConflicts({ mrDetail: { is_conflict } }) {
        return is_conflict;
    }
    static isMerged({ mrDetail: { state } }) {
        return state === 'merged';
    }
    static isMyMr({ mrDetail: { author: { id } } }) {
        const userId = store.getState().user.id;
        return id === userId;
    }


}
