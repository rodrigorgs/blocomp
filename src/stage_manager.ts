interface StageManager {
    clear(): void;
    outcome(): StageOutcome
}

interface StageOutcome {
    successful: boolean;
    message: string;
}