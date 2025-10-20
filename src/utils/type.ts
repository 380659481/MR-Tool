import { MrUtils } from "./mrUtils";

export const  myMrTypes = [{
    isActivated: true,
    style: {
        color: {
            "common": "gray",
            "galaxyTheme": "gray"
        },
        tags: [
            "已合入"
        ]
    },
    test(mrInfo) {
        return MrUtils.isMerged(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "red",
            "galaxyTheme": "red"
        },
        tags: [
            "有冲突"
        ]
    },
    test(mrInfo) {
        return MrUtils.hasConflicts(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "gray",
            "galaxyTheme": "gray"
        },
        tags: [
            "流水线运行中"
        ]
    },
    test(mrInfo) {
        return MrUtils.isPipelineRunning(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "red",
            "galaxyTheme": "red"
        },
        tags: [
            "流水线未通过"
        ]
    },
    test(mrInfo) {
        return !MrUtils.isPipelineSuccess(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "blue",
            "galaxyTheme": "blue"
        },
        tags: [
            "有待处理的检视意见"
        ]
    },
    test(mrInfo) {
        return MrUtils.hasOtherDiscussionUnresolved(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "purple",
            "galaxyTheme": "purple"
        },
        tags: [
            "必选检视人"
        ]
    },
    test(mrInfo) {
        return MrUtils.isRequiredReviewer(mrInfo) && !MrUtils.isMyReviewed(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "gray",
            "galaxyTheme": "gray"
        },
        tags: [
            "待合入"
        ]
    },
    test() {
        return true;
    }
}];

export const otherMrTypes = [{
    isActivated: true,
    style: {
        color: {
            "common": "gray",
            "galaxyTheme": "gray"
        },
        tags: [
            "已合入"
        ]
    },
    test(mrInfo) {
        return MrUtils.isMerged(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "gray",
            "galaxyTheme": "gray"
        },
        tags: [
            "有冲突"
        ]
    },
    test(mrInfo) {
        return MrUtils.hasConflicts(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "gray",
            "galaxyTheme": "gray"
        },
        tags: [
            "流水线未通过"
        ]
    },
    test(mrInfo) {
        return !MrUtils.isPipelineSuccess(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "green",
            "galaxyTheme": "green"
        },
        tags: [
            "已审批",
            "可合入"
        ]
    },
    test(mrInfo) {
        return MrUtils.isMergeable(mrInfo) && MrUtils.hasMergePermission(mrInfo) && MrUtils.isMyApproved(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "gray",
            "galaxyTheme": "gray"
        },
        tags: [
            "已审批"
        ]
    },
    test(mrInfo) {
        return MrUtils.isMyReviewed(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "gold",
            "galaxyTheme": "gold"
        },
        tags: [
            "未审批",
            "可合入"
        ]
    },
    test(mrInfo) {
        return MrUtils.isMergeable(mrInfo) && MrUtils.hasMergePermission(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "gray",
            "galaxyTheme": "gray"
        },
        tags: [
            "所有检视意见均未修复"
        ]
    },
    test(mrInfo) {
        return MrUtils.isAllMyDiscussionUnresolved(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "purple",
            "galaxyTheme": "purple"
        },
        tags: [
            "必选检视人"
        ]
    },
    test(mrInfo) {
        return MrUtils.isRequiredReviewer(mrInfo);
    }
}, {
    isActivated: true,
    style: {
        color: {
            "common": "black",
            "galaxyTheme": "#FFC8B4"
        },
        tags: [
            "待检视"
        ]
    },
    test() {
        return true;
    }
}];