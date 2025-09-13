import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { error: null } }
  componentDidCatch(error, info){ console.error(error, info); this.setState({ error }) }
  render(){
    if (this.state.error) {
      return (
        <div style={{ padding: 16 }}>
          <h2>💥 Помилка рендеру</h2>
          <pre style={{ whiteSpace:'pre-wrap' }}>{String(this.state.error.stack || this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
