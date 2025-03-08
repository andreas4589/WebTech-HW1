class Person {
    #firstName;
    #lastName;

    constructor(firstName, lastName) {
        this.setFirstName(firstName);
        this.setLastName(lastName);
    }

    set setFirstName(value) {
        if (value.length < 3) {
            throw new Error('First name must be at least 3 characters long');
        }
        this.#firstName = value;
    }

    set setLastName(value) {
        if (value.length < 3) {
            throw new Error('Last name must be at least 3 characters long');
        }
        this.#lastName = value;
    }

    get getFirstName() {
        return this.#firstName;
    }

    get getLastName() {
        return this.#lastName;
    }
}

class Course {
    #title;
    #teacher;
    #description;

    constructor(title, teacher, description) {
        this.setTitle(title);
        this.setTeacher(teacher);
        this.setDescription(description);
    }

    set setTitle(value) {
        if (value.length < 3) {
            throw new Error('Title must be at least 3 characters long');
        }
        this.#title = value;
    }

    set setTeacher(value) {
        if (value.length < 6) {
            throw new Error('Teacher must be at least 6 characters long');
        }
        this.#teacher = value;
    }

    set setDescription(value) {
        if (value.length < 10) {
            throw new Error('Description must be at least 10 characters long');
        }
        this.#description = value;
    }

    get getTitle() {
        return this.#title;
    }

    get getTeacher() {
        return this.#teacher;
    }

    get getDescription() {
        return this.#description;
    }
}

class Student extends Person {
    #age;
    #hobbies;
    #email;
    #photo;
    #major;
    #courses = [Course];

    constructor(firstName, lastName, age, hobbies, email, photo, major, courses) {
        super(firstName, lastName);
        this.setAge(age);
        this.setHobbies(hobbies);
        this.setEmail(email);
        this.setPhoto(photo);
        this.setMajor(major);
        this.setCourses(courses);
    }

    set setAge(value) {
        if (value < 0) {
            throw new Error('Age must be a positive number');
        }
        this.#age = value;
    }

    set setHobbies(value) {
        if (value.length === 0) {
            throw new Error('Hobbies must be at least one');
        }
        this.#hobbies = value;
    }

    set setEmail(value) {
        if (!value.includes('@')) {
            throw new Error('Invalid email');
        }
        this.#email = value;
    }

    set setPhoto(value) {
        if (!value.includes('http')) {
            throw new Error('Invalid photo');
        }
        this.#photo = value;
    }

    set setMajor(value) {
        if (value.length < 3) {
            throw new Error('Major must be at least 3 characters long');
        }
        this.#major = value;
    }

    set setCourses(value) {
        if (value.length === 0) {
            throw new Error('Courses must be at least one');
        }
        this.#courses += value;
    }

    get getAge() {
        return this.#age;
    }

    get getHobbies() {
        return this.#hobbies;
    }

    get getEmail() {
        return this.#email;
    }

    get getPhoto() {
        return this.#photo;
    }

    get getMajor() {
        return this.#major;
    }

    get getCourses() {
        return this.#courses;
    }
}

