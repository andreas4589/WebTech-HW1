import { Person } from './person.js';
class Course {
    #title;
    #teacher; 
    #description;

    constructor(title, teacher, description) {
        this.title = title; 
        this.teacher = teacher;
        this.description = description;
    }

    set title(value) {
        if (typeof value !== "string" || value.length < 3) {
            throw new Error("Title must be at least 3 characters long.");
        }
        this.#title = value;
    }

    set teacher(value) {
        if (!(value instanceof Person)) {
            throw new Error("Teacher must be an instance of Person.");
        }
        this.#teacher = value;
    }

    set description(value) {
        if (typeof value !== "string" || value.length < 10) {
            throw new Error("Description must be at least 10 characters long.");
        }
        this.#description = value;
    }

    get title() {
        return this.#title;
    }

    get teacher() {
        return this.#teacher;
    }

    get description() {
        return this.#description;
    }
}

export { Course };