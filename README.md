# Pintereach API


# User Routes

### Register a User (unrestricted)

HTTP Request: POST

Url: /api/auth/register

#### Body

| Name     | Type   | Required | Description   |
|----------|--------|----------|---------------|
| email    | string | yes      | Must be unique|
| username | string | yes      | Must be unique|
| password | string | yes      | password      |

#### Example:
```javascript
{
    "email":"123@email.com",
    "username":"JohnSmith",
    "password":"JohnSmith123"
}
```
### Responses:

#### 201 (Created)

> Will recieve a 201 response with the newly created user if successful
```javascript
{
    "id": 1,
    "username":"JohnSmith"
}
```

#### 400 (Bad Request)

> Will recieve a 400 response if information is not valid
```javascript
{
    "message": "please provide valid credentials"
}
```

##### 500 (Internal Server Error)
> Will receive a 500 response if there is a problem with the server
```javascript
{
  "message": "Internal Server Error"
}
```
***

### Login

HTTP Request: POST

URL: /api/auth/login

#### Body

| Name     | Type   | Required | Description   |
|----------|--------|----------|---------------|
| username | string | yes      | username      |
| password | string | yes      | password      |

#### Example:
```javascript
{
    "username":"JohnSmith",
    "password":"JohnSmith123"
}
```
### Responses:

#### 200 (Successful)

> Will recieve a 200 response with the user token if the request is successful

```javascript
{
    "token": "jsonwebtokenhere"
}
```

#### 400 (Bad Request)

> Will recieve a 400 response if information is not valid
```javascript
{
    "message": "please provide a valid username and password"
}
```

#### 401 (Bad Request)

> Will recieve a 401 response if information is not valid
```javascript
{
    "message": "username or password does not match."
}
```

##### 500 (Internal Server Error)
> Will receive a 500 response if there is a problem with the server
```javascript
{
  "message": "Internal Server Error"
}
```
***

