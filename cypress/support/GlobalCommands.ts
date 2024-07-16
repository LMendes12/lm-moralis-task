class GlobalCommands {

    public goTo(url: string) {
        cy.visit(url)
    }

    public getRandomFiveDigitNumber(): number {
        const min = 10000;
        const max = 99999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export default new GlobalCommands();