class Person {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

class Course {
    constructor(title, teacher, description) {
        this.title = title;
        this.teacher = teacher;
        this.description = description;
    }
}

class Student extends Person {
    #age;
    #hobbies;
    #email;
    #photo;
    #major;
    #courses = [Course];

    set age(value) {
        if (value < 0) {
            throw new Error('Age must be a positive number');
        }
        this.#age = value;
    }

    set hobbies(value) {
        if (value.length === 0) {
            throw new Error('Hobbies must be at least one');
        }
        this.#hobbies = value;
    }

    set email(value) {
        if (!value.includes('@')) {
            throw new Error('Invalid email');
        }
        this.#email = value;
    }

    set photo(value) {
        if (!value.includes('http')) {
            throw new Error('Invalid photo');
        }
        this.#photo = value;
    }

    set major(value) {
        if (value.length < 3) {
            throw new Error('Major must be at least 3 characters long');
        }
        this.#major = value;
    }

    set courses(value) {
        if (value.length === 0) {
            throw new Error('Courses must be at least one');
        }
        this.#courses += value;
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

