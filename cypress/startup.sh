JSON_STRING='{
"baseUrl":"'"$(BASE_URL)"'", 
"loginAdminUserName":"'"$(LOGIN_ADMIN_USER_NAME)"'",
"loginAdminPassword":"'"$(LOGIN_ADMIN_PASSWORD)"'", 
"loginHOUserName":"'"$(LOGIN_ADMIN_USER_NAME)"'",
"loginHOPassword":"'"$(LOGIN_HO_USER_PASSWORD)"'"
}'
echo $JSON_STRING
touch  ./cypress.env.json
echo $JSON_STRING > ./cypress.env.json
