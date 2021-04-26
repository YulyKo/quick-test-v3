export class QuestionsError extends Error {
  body: any;
  constructor(message: string, params?: any) {
    super(message);
    this.body = params;
  }
}
