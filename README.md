# End-to-End Tests for Team API Project



## Content 📖

This repository contains End-to-End (E2E) tests related to the repository: [https://github.com/JorgeSilva7/Team-api](https://github.com/JorgeSilva7/Team-api).

## Execution Steps 🚀:

1. **Run the Team API project.**

2. **Create an additional admin to the default (the following values are examples):**

    ```bash
    CREATE_ADMIN=true
    CREATE_ADMIN_EMAIL="admintest@example.com"
    CREATE_ADMIN_PASSWORD="testing"
    CREATE_ADMIN_NAME="testing"
    ```

3. **Create a club and assign the ID of the previously created admin.**

4. **Modify the value of the constant "idClubTest" in the test suite located at "`./test/team/club/addMember.test.js`" with the ID of the club created earlier.**

5. **Run the following commands:**

    ```bash
    npm i
    npm run test
    ```
## Contributors 👥:

-   César Soto
-   Christopher Alarcón
