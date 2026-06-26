export function runJavaScript(code) {
  const lines = []

  const append = (prefix, values) => {
    const text = values
      .map((value) => {
        if (typeof value === 'string') return value
        try {
          return JSON.stringify(value, null, 2)
        } catch {
          return String(value)
        }
      })
      .join(' ')

    lines.push(prefix ? `${prefix}${text}` : text)
  }

  const sandboxConsole = {
    log: (...values) => append('', values),
    info: (...values) => append('[info] ', values),
    warn: (...values) => append('[warn] ', values),
    error: (...values) => append('[error] ', values),
  }

  try {
    const runner = new Function('console', `"use strict";\n${code}`)
    const result = runner(sandboxConsole)

    if (result !== undefined) {
      append('→ ', [result])
    }

    if (lines.length === 0) {
      lines.push('Code ran successfully (no output).')
    }

    return { output: lines.join('\n'), error: null }
  } catch (error) {
    const runtimeOutput = lines.length > 0 ? `${lines.join('\n')}\n\n` : ''
    return {
      output: runtimeOutput,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export function canRunLanguage(language) {
  return language === 'javascript'
}
