export interface Problem {
    name: string;
    description: string;
    testCases: Array<TestCase>;
}

export interface TestCase {
    input: string;
    output: string;
}
