## Notedly Backend

Using TypeScript + Apollo Koa Server 💊

## Query example

```graphql
mutation Mutation($newNoteContent: String!) {
  newNote(content: $newNoteContent) {
    id
    content
    author {
      id
      username
    }
  }
}

mutation SignUpMutation($signUpUsername: String!, $signUpEmail: String!, $signUpPassword: String!) {
  signUp(username: $signUpUsername, email: $signUpEmail, password: $signUpPassword)
}
query Query($noteId: ID!) {
  note(id: $noteId) {
    favoriteCount
    favoritedBy {
      id
      username
    }
  }
}

query NoteFeed($noteFeedCursor: String) {
  noteFeed(cursor: $noteFeedCursor) {
    notes {
      id
      author {
        username
        id
        email
        avatar
      }
      createdAt
      content
      favoriteCount
      favoritedBy {
        id
        username
      }
    }
    cursor
    hasNextPage
  }
}

query Me($meCursor: ID) {
  me {
    id
    username
    myNotes(cursor: $meCursor) {
      notes {
        id
        content
      }
      hasNextPage
      cursor
    }
  }
}
```