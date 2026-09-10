export interface FetchedData {
    profile: {
        username: string;
        realname: string;
        about: string;
        avatar: string;
        skills: string[];
        country: string;
    };
    problem: {
        easy: {
            solved: number;
            total: number;
        };
        medium: {
            solved: number;
            total: number;
        };
        hard: {
            solved: number;
            total: number;
        };
        ranking: number;
    };
    submissions: {
        title: string;
        lang: string;
        time: number;
        status: string;
        id: string;
        slug: string;
    }[];
    contest?: {
        rating: number;
        ranking: number;
        badge: string;
    };
    submissionCalendar?: string;
    [key: string]: unknown;
}
