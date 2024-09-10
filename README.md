# one-take-a-day

This application is no longer hosted

## Backend
In One Take A Day, I have chosen Node.js and Express.js as the backend technologies, which enable me to efficiently connect my React.js frontend to the PostgreSQL backend for seamless data storage and management. Using the power of Node.js, I can leverage the non-blocking, event-driven architecture to handle multiple client requests simultaneously, ensuring high performance and responsiveness. Express.js provides a robust framework for building RESTful APIs, allowing me to define endpoints that interact with the database. To implement secure authentication, I rely on bcrypt for hashing and verifying passwords, which ensures that user credentials are securely stored. JSON Web Tokens (JWT) are utilized for token-based authentication, enabling users to authenticate and access protected routes. Furthermore, cookies are employed to store session information, allowing for persistent login sessions. This combination of technologies forms a reliable and efficient backend that seamlessly connects my React.js frontend to the PostgreSQL database while implementing robust authentication mechanisms.

## Frontend
For One Take a Day, I have chosen React.js as the frontend framework to efficiently and modularly represent my application. React's component-based architecture allows for the creation of reusable and independent UI components, promoting code reusability and maintainability. By leveraging React's virtual DOM, the application efficiently updates only the necessary components, resulting in faster rendering and improved performance. To enhance the user interface and user experience, I have integrated Tailwind CSS, a utility-first CSS framework. Tailwind CSS provides a wide range of pre-built utility classes that can be easily applied to components, enabling rapid prototyping and consistent styling across the application. With React and Tailwind CSS, I can efficiently build a visually appealing and user-friendly interface for One Take a Day.


## Database
I have selected PostgreSQL as the database for my application primarily because of its ability to handle complex and advanced queries, which is essential for my project. In particular, when querying a user's post, I need to retrieve data from multiple tables such as the post table, account table, hashtag_post table, hashtag table, like table, and comment table. PostgreSQL's robust query capabilities, including JOINs, subqueries, and aggregate functions, allow me to efficiently retrieve and combine data from these interconnected tables. I can leverage its powerful querying features to filter, sort, and aggregate data based on various criteria, enabling me to provide users with comprehensive and customized post-related information. The flexibility and expressive nature of PostgreSQL's query language make it an ideal choice for handling complex data retrieval tasks in my application.
