export interface Problem {
    /**
     * Must be the same as the problem's filename (minus the extension).
     */
    id?: string;
    name: string;
    description: string;
    testCases: Array<TestCase>;
    initialWorkspace?: object;
}

export interface TestCase {
    input: string;
    output: string;
    data: any;
}
