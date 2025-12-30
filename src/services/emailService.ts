
class EmailService {
  async send(
    template: string,
    data: Record<string, any>
  ): Promise<void> {
    console.log("Sending Email ");
    console.log("Template:", template);
    // console.log("Payload:", data);
    await this.fakeDelay(500);
    console.log("Email sent successfully of template:", template);
  }

  private async fakeDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const emailService = new EmailService();
