class Student extends Person {
    #age;
    #hobbies;
    #email;
    #photo;
    #major;
    #courses = [];

    constructor(firstName, lastName, age, hobbies, email, photo, major, courses) {
        super(firstName, lastName);
        this.age = age; // Use setter for validation
        this.hobbies = hobbies;
        this.email = email;
        this.photo = photo;
        this.major = major;
        this.courses = courses;
    }

    // Setter for age (validates positive integer)
    set age(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("Age must be a positive integer.");
        }
        this.#age = value;
    }

    // Setter for hobbies (must be a non-empty array)
    set hobbies(value) {
        if (!Array.isArray(value) || value.length === 0) {
            throw new Error("Hobbies must be an array with at least one hobby.");
        }
        this.#hobbies = value;
    }

    // Setter for email (validates correct email format)
    set email(value) {
        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!emailPattern.test(value)) {
            throw new Error("Invalid email format.");
        }
        this.#email = value;
    }

    // Setter for photo (validates a proper URL ending in an image file extension)
    set photo(value) {
        const urlPattern = /^https?:\/\/.+\.(jpg|png|jpeg|gif)$/;
        if (!urlPattern.test(value)) {
            throw new Error("Invalid photo URL. It must be a valid link to an image.");
        }
        this.#photo = value;
    }

    set major(value) {
        if (typeof value !== "string" || value.length < 3) {
            throw new Error("Major must be at least 3 characters long.");
        }
        this.#major = value;
    }

    // Setter for courses (must be an array of Course instances)
    set courses(value) {
        if (!Array.isArray(value) || value.some(course => !(course instanceof Course))) {
            throw new Error("Courses must be an array containing only Course instances.");
        }
        this.#courses = [...value]; 
    }

    get age() {
        return this.#age;
    }

    get hobbies() {
        return this.#hobbies;
    }

    get email() {
        return this.#email;
    }

    get photo() {
        return this.#photo;
    }

    get major() {
        return this.#major;
    }

    get courses() {
        return this.#courses;
    }
}
