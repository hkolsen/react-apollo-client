import React from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag"
import recipesQuery from "./recipesQuery";
import { useInput } from "./useInput";

const addRecipeMutation = gql`
  mutation addRecipe($recipe: RecipeInput!) {
    addRecipe(recipe: $recipe) {
      id
      title
    }
  }
`

export const AddRecipe = () => {
    const { value:vegetarian, bind:bindVegetarian, reset:resetVegetarian } = useInput(false);
    const { value:title, bind:bindTitle, reset:resetTitle } = useInput('');
    const resetFields = () => {
        resetVegetarian();
        resetTitle();
    }
    return <Mutation
    mutation={addRecipeMutation}
    refetchQueries={[
      {
        query: recipesQuery,
        variables: { vegetarian: true }
      },
      {
        query: recipesQuery,
        variables: { vegetarian: false }
      }
    ]}
    awaitRefetchQueries={true}
  >
    {(addRecipe, { loading, error }) => (
      <form
          onSubmit={event => {
          event.preventDefault();
          addRecipe({
            variables: {
              recipe: {
                title: title,
                vegetarian: vegetarian
              }
            }
          })
          resetFields();
          }}
      >
          <label>
            <span>Title</span>
            <input type="text" {...bindTitle} />
          </label>
          <label>
            <input type="checkbox" {...bindVegetarian} />
            <span>Vegetarian</span>
          </label>
          <div>
            <button>Add Recipe</button>
            { loading && <p>Loading...</p> }
            { error && <p>Error: Please try again</p> }
          </div>
      </form>
    )}
  </Mutation>;
  }
