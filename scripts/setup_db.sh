#!/usr/bin/env bash

IFS=$'\n' # this is why I don't quote my vars - so before you file an issue...

DB_FILE="mock/db.json"
DB_PORT=3000
E_FILENOTFOUND=2

INSTANCE=$(lsof -n -i :$DB_PORT | grep LISTEN | awk '{ print $2 }')

[[ -z $INSTANCE ]] && exit 0

kill $INSTANCE 2>/dev/null

if [[ -e $DB_FILE ]]; then
  cat > $DB_FILE <<END
{
  "people": [
    {
      "name": "La Monte Young",
      "id": "0"
    },
    {
      "name": "John Cale",
      "id": "1"
    },
    {
      "name": "Lou Reed",
      "id": "2"
    },
    {
      "name": "Walter De Maria",
      "id": "3"
    },
    {
      "name": "Bjork",
      "id": "4"
    },
    {
      "name": "Matthew Barney",
      "id": "5"
    },
    {
      "name": "Chris Burden",
      "id": "6"
    }
  ]
}
END
  echo -e "[+] Mock database $DB_FILE has been reset\n"
else
  echo -e "[-] Mock database $DB_FILE not found\n"
  exit $E_FILENOTFOUND
fi
