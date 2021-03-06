import React, { useState, useEffect } from 'react'
import { observe, createStore } from 'dahlia-store'

import { config, fetch, useFetch, useUpdate, fetcher } from '../../src'

config({
  endpoint: 'https://jsonplaceholder.typicode.com',
})

enum Api {
  GetTodo = 'GET /todos/:id',
  CreateTodo = 'POST /todos',
}

interface Todo {
  id: number
  title: string
  completed: boolean
}

const FetchApp = () => {
  const [data, setData] = useState()
  async function fetchData() {
    const res = await fetch<Todo>('/todos/1')
    setData(res)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return <pre className="App">{JSON.stringify(data, null, 2)}</pre>
}

const store = createStore({
  id: 1,
  setId() {
    store.id = 2
  },
})

setTimeout(() => {
  store.setId()
  console.log(fetcher)
}, 2000)

const UseFetchApp = observe(() => {
  const { loading, data, error, refetch } = useFetch<Todo>(Api.GetTodo, {
    param: { id: store.id },
    deps: [store.id],
  })

  const handleClick = async () => {
    const r = await refetch<Todo>({ param: { id: 2 } })
    console.log('r:', r)
  }

  if (loading) return <div>loading....</div>
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>

  return (
    <div className="App">
      <h2>useFetch</h2>
      <button onClick={handleClick}>refetch</button>
      <button onClick={() => fetcher[Api.GetTodo].refetch({ param: { id: 3 } })}>
        refetch with fetcher
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
})

const UseUpdateApp = () => {
  const [addTodo, { loading, data, error }] = useUpdate(Api.CreateTodo)

  return (
    <div className="App">
      <button onClick={() => addTodo({ body: { title: 'New TODO' } })}>
        {loading === undefined && 'Add Todo'}
        {loading !== undefined && (loading ? 'loading...' : ' Added')}
      </button>

      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

export default () => (
  <div>
    <FetchApp />
    <UseFetchApp />
    <UseUpdateApp />
  </div>
)
