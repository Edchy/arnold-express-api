# API Documentation

## Overview

This document provides an overview of the API routes, their purposes, required parameters, and how to use JWT tokens for authentication.

## Table of Contents

1. [Public Routes](#public-routes)
   - [User Registration](#user-registration)
   - [User Login](#user-login)
2. [Protected Routes](#protected-routes)
   - [Get All Users](#get-all-users)
   - [Get User by ID](#get-user-by-id)
3. [Authentication Flow](#authentication-flow)
   - [Obtaining a Token](#obtaining-a-token)
   - [Using the Token](#using-the-token)

## Public Routes

### User Registration

- **Endpoint**: `/users`
- **Method**: `POST`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
