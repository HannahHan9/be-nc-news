# Northcoders News API

This API serves as a backend server application designed to offer access to multiple endpoints, facilitating the retrieval and manipulation of data. Users can interact with the API to carry out tasks like fetching articles, posting comments, voting on both articles and comments.

If you would like to run this project locally, please follow the steps below:

1. Clone the repository ```git clone https://github.com/HannahHan9/be-nc-news.git```
2. cd into the project directory ```cd be-nc-news```
3. Run ```npm install``` to install packages listed in the package.json

You will need to create two .env files for your project: .env.test and .env.development. Into .env.test, add PGDATABASE=nc_news_test; and into .env.development, add PGDATABASE=nc_news;. Double check that these .env files are .gitignored.

This project is hosted on https://nc-news-49cb.onrender.com/api/
