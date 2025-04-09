Group id:
G38

Names and student numbers of all authors:
Andreas Meeldijk 0892734
Taha Sebai 5372135
Max Maes 5105269

Link:
http://webtech.science.uu.nl/group38/

A brief explanation of your web-site, the structure of your application, including every content file and every code file, the structure of your database:

Our website was originally a cooking website where users could access various recipes, culinary news, and related content.
However, for this assignment, we extended the website’s functionality by adding social media features.



When a user first visits the website, they land on the index page, where they can either log in (if they already have an account) or register a new account.
Registration happens on a dedicated page, where the user fills out a form with their information: firstName, email, course, etc.
This information is then stored in the database.
Once the user logs in or registers successfully, a session is created (storing the user’s email), and they are redirected to the home page.


From the home page, the user can either explore culinary news (original cooking-related content), or access new social media features via the navigation bar:
- view profile: the user can see all of his information except for their password for security measures.
- edit profile: the user can modifiy their information.
  A pre-filled form is shown with the current data (excluding the email, which serves as the unique ID).
  Once submitted, the new information is saved to the database, and the user is redirected to the profile page.
- My courses: The user can view all courses they are enrolled in.
  Clicking on a course redirects them to a course-specific page (/courses/course/:name) where they can see who else is enrolled,
  send friend requests to other students, or navigate back to the courses list
- Friends: The user can see all their current friends, visit their friends’ profiles (to check which courses they are enrolled in),
  and view and accept friend requests to grow their network
- Check your messages (Inbox): Users can view their full message history.
  Each message displays the sender, the content, and a reply button.
- Write a message: from this page, the user can send a new message to any of their friends.





The SQL definition of your database (the CREATE TABLE statements):

CREATE TABLE IF NOT EXISTS users (firstName TEXT, lastName TEXT, password TEXT, email TEXT, major TEXT, age NUMERIC, photo TEXT, hobbies TEXT)
CREATE TABLE IF NOT EXISTS user_courses (user_email TEXT, course_name TEXT)
CREATE TABLE IF NOT EXISTS friends (user_email TEXT, friend_email TEXT)
CREATE TABLE IF NOT EXISTS messages (sender TEXT, recipient TEXT, message TEXT)
CREATE TABLE IF NOT EXISTS friend_requests (sender TEXT, recipient TEXT)


users: Stores all user information except course enrollments.
    email acts as a unique identifier (ID) for each user.
user_courses: Tracks course enrollments.
    This table allow a user to be enrolled in multiple courses without data redundancy.
friends: Stores established friendships between users.
    This table allows users to have multiple friends without redundancy.
messages: Records all messages exchanged between users.
friend_requests: Keeps track of pending friend requests.


Logins and passwords of all registered users:
