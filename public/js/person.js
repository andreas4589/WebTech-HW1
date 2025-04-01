class Person {
    #firstName;
    #lastName;

    constructor(firstName, lastName) {
        this.firstName = firstName; 
        this.lastName = lastName;
    }

    set firstName(value) {
        if (typeof value !== "string" || value.length < 3) {
            throw new Error("First name must be at least 3 characters long");
        }
        this.#firstName = value;
    }

    set lastName(value) {
        if (typeof value !== "string" || value.length < 3) {
            throw new Error("Last name must be at least 3 characters long");
        }
        this.#lastName = value;
    }

    get firstName() {
        return this.#firstName;
    }

    get lastName() {
        return this.#lastName;
    }
}

export { Person };