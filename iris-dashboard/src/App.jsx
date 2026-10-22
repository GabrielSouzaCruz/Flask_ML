import { useState } from 'react'

const API_URL = 'https://irisflaskml-enfye5f5bxfcd6bt.brazilsouth-01.azurewebsites.net/api/predict'

const SPECIES_CONFIG = {
  Setosa: {
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-800',
    emoji: '🌸',
  },
  Versicolor: {
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-800',
    emoji: '🌺',
  },
  Virginica: {
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    emoji: '🌼',
  },
}

const defaultConfig = {
  color: 'from-indigo-500 to-blue-600',
  bg: 'bg-blue-50',
  border: 'border-blue-200',
  badge: 'bg-blue-100 text-blue-800',
  emoji: '🌷',
}

const fields = [
  { key: 'sepal_length', label: 'Comprimento da Sépala', unit: 'cm', placeholder: '6.7', hint: '4.3 – 7.9 cm' },
  { key: 'sepal_width',  label: 'Largura da Sépala',     unit: 'cm', placeholder: '3.0', hint: '2.0 – 4.4 cm' },
  { key: 'petal_length', label: 'Comprimento da Pétala', unit: 'cm', placeholder: '5.2', hint: '1.0 – 6.9 cm' },
  { key: 'petal_width',  label: 'Largura da Pétala',     unit: 'cm', placeholder: '2.3', hint: '0.1 – 2.5 cm' },
]

export default function App() {
  const [form, setForm] = useState({
    sepal_length: '',
    sepal_width: '',
    petal_length: '',
    petal_width: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    const payload = {}
    for (const { key } of fields) {
      const val = parseFloat(form[key])
      if (isNaN(val)) {
        setError(`O campo "${fields.find(f => f.key === key).label}" precisa ser um número válido.`)
        return
      }
      payload[key] = val
    }

    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Erro ${res.status}: ${text || res.statusText}`)
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Falha ao conectar com a API. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({ sepal_length: '', sepal_width: '', petal_length: '', petal_width: '' })
    setResult(null)
    setError(null)
  }

  const species = result?.predicao
  const config = SPECIES_CONFIG[species] ?? defaultConfig

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-start py-10 px-4">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
          <span className="text-3xl">🌸</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Iris Predictor</h1>
        <p className="mt-2 text-slate-500 text-sm max-w-xs mx-auto">
          Insira as medidas da flor e descubra a espécie com machine learning.
        </p>
      </header>

      <div className="w-full max-w-lg space-y-6">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">Medidas da Flor</h2>
            <p className="text-indigo-200 text-xs mt-0.5">Todos os valores em centímetros (cm)</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ key, label, unit, placeholder, hint }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label htmlFor={key} className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={key}
                      name={key}
                      type="number"
                      step="0.1"
                      value={form[key]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
                      {unit}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{hint}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Prevendo…
                  </>
                ) : (
                  <>
                    <span>🔍</span> Prever Espécie
                  </>
                )}
              </button>
              {(result || error) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium transition"
                >
                  Limpar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Result Card */}
        {result && (
          <div className={`rounded-2xl shadow-lg border ${config.border} ${config.bg} overflow-hidden animate-fade-in`}>
            <div className={`bg-gradient-to-r ${config.color} px-6 py-4 flex items-center gap-3`}>
              <span className="text-3xl">{config.emoji}</span>
              <div>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Espécie Prevista</p>
                <h3 className="text-white text-2xl font-bold">{species}</h3>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${config.badge}`}>
                  <span className="w-2 h-2 rounded-full bg-current opacity-60" />
                  Predição: <strong className="ml-1">{species}</strong>
                </span>
                <span className="text-slate-400 text-xs">código {result.codigo}</span>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Dados Enviados</p>
                <div className="grid grid-cols-2 gap-2">
                  {fields.map(({ key, label }) => (
                    <div key={key} className="bg-white/70 rounded-xl px-3 py-2 border border-white/80">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-sm font-semibold text-slate-700">{result.dados_recebidos[key]} cm</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-10 text-center text-xs text-slate-400">
        Modelo treinado com o dataset Iris · UCI Machine Learning Repository
      </footer>
    </div>
  )
}
