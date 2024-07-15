class GlobalCommands {

    public goTo(url: string) {
        cy.visit(url)
    }
}

export default new GlobalCommands();