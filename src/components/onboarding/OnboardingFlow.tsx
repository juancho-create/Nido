'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useNidoStore } from '@/lib/store/useNidoStore'

type Step = 0 | 1 | 2 | 3 | 4

interface FormState {
  name: string
  quitDate: string
  cigarettesPerDay: number
  pricePerPack: number
  cigarettesPerPack: number
  motivation: string
}

const MOTIVATIONS = [
  'Mi salud y mi futuro',
  'Mi familia y seres queridos',
  'Ahorrar dinero',
  'Sentirme libre',
  'Ser un ejemplo para otros',
]

export function OnboardingFlow() {
  const router = useRouter()
  const completeOnboarding = useNidoStore((s) => s.completeOnboarding)

  const [step, setStep] = useState<Step>(0)
  const [form, setForm] = useState<FormState>({
    name: '',
    quitDate: new Date().toISOString().split('T')[0],
    cigarettesPerDay: 10,
    pricePerPack: 5,
    cigarettesPerPack: 20,
    motivation: '',
  })

  function next() { setStep((s) => Math.min(s + 1, 4) as Step) }
  function back() { setStep((s) => Math.max(s - 1, 0) as Step) }

  function finish() {
    completeOnboarding({
      name: form.name,
      quitDate: form.quitDate,
      cigarettesPerDay: form.cigarettesPerDay,
      pricePerPack: form.pricePerPack,
      cigarettesPerPack: form.cigarettesPerPack,
      motivation: form.motivation,
    })
    router.replace('/habitat')
  }

  const steps = [
    <StepWelcome   key={0} form={form} setForm={setForm} onNext={next} />,
    <StepQuitDate  key={1} form={form} setForm={setForm} onNext={next} onBack={back} />,
    <StepProfile   key={2} form={form} setForm={setForm} onNext={next} onBack={back} />,
    <StepMotivation key={3} form={form} setForm={setForm} onNext={next} onBack={back} motivations={MOTIVATIONS} />,
    <StepFirstBird  key={4} form={form} onFinish={finish} onBack={back} />,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-nido-sky/50 to-nido-cream flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-12 pb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === step
                ? 'w-6 h-2 bg-nido-sage'
                : i < step
                ? 'w-2 h-2 bg-nido-sage/60'
                : 'w-2 h-2 bg-nido-sage/20'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepWelcome({
  form, setForm, onNext,
}: {
  form: FormState
  setForm: (f: FormState) => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-3">
        <div className="text-7xl mb-2">🪺</div>
        <h1 className="text-3xl font-bold text-nido-dusk">Bienvenido a Nido</h1>
        <p className="text-nido-dusk/60 text-base leading-relaxed">
          Un lugar donde cada día sin fumar hace crecer un ecosistema vivo.
          No hay formularios. Solo un camino, un pájaro a la vez.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">¿Cómo te llamas?</Label>
        <Input
          id="name"
          placeholder="Tu nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={onNext}
        disabled={!form.name.trim()}
      >
        Empezar mi camino →
      </Button>
    </div>
  )
}

function StepQuitDate({
  form, setForm, onNext, onBack,
}: {
  form: FormState
  setForm: (f: FormState) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="text-5xl mb-2">📅</div>
        <h2 className="text-2xl font-bold text-nido-dusk">Tu fecha de inicio</h2>
        <p className="text-nido-dusk/60 text-sm">
          ¿Cuándo decidiste o quieres dejar de fumar?
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quitDate">Fecha de inicio</Label>
        <Input
          id="quitDate"
          type="date"
          value={form.quitDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setForm({ ...form, quitDate: e.target.value })}
        />
        <p className="text-xs text-nido-dusk/40">
          Si ya llevas días sin fumar, ponla en el pasado para que cuente tu racha real.
        </p>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

function StepProfile({
  form, setForm, onNext, onBack,
}: {
  form: FormState
  setForm: (f: FormState) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="text-5xl mb-2">💰</div>
        <h2 className="text-2xl font-bold text-nido-dusk">Tu consumo habitual</h2>
        <p className="text-nido-dusk/60 text-sm">
          Esto nos ayuda a calcular cuánto dinero y salud estás recuperando.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Cigarrillos por día</Label>
          <Input
            type="number"
            min={1} max={100}
            value={form.cigarettesPerDay}
            onChange={(e) =>
              setForm({ ...form, cigarettesPerDay: Number(e.target.value) })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Precio por cajetilla</Label>
            <Input
              type="number"
              min={0} step={0.5}
              value={form.pricePerPack}
              onChange={(e) =>
                setForm({ ...form, pricePerPack: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Cigarrillos/cajetilla</Label>
            <Input
              type="number"
              min={1} max={40}
              value={form.cigarettesPerPack}
              onChange={(e) =>
                setForm({ ...form, cigarettesPerPack: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

function StepMotivation({
  form, setForm, onNext, onBack, motivations,
}: {
  form: FormState
  setForm: (f: FormState) => void
  onNext: () => void
  onBack: () => void
  motivations: string[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="text-5xl mb-2">💚</div>
        <h2 className="text-2xl font-bold text-nido-dusk">¿Por qué lo haces?</h2>
        <p className="text-nido-dusk/60 text-sm">
          Tu razón es tu ancla. La guardaremos para los momentos difíciles.
        </p>
      </div>

      <div className="space-y-2">
        {motivations.map((m) => (
          <button
            key={m}
            onClick={() => setForm({ ...form, motivation: m })}
            className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-medium transition-all border ${
              form.motivation === m
                ? 'bg-nido-sage text-white border-nido-sage'
                : 'bg-white/60 text-nido-dusk border-white/70 hover:bg-white/80'
            }`}
          >
            {m}
          </button>
        ))}
        <Textarea
          placeholder="O escribe tu propia razón…"
          value={motivations.includes(form.motivation) ? '' : form.motivation}
          onChange={(e) => setForm({ ...form, motivation: e.target.value })}
          rows={2}
        />
      </div>

      <NavButtons onBack={onBack} onNext={onNext} disabled={!form.motivation.trim()} />
    </div>
  )
}

function StepFirstBird({
  form, onFinish, onBack,
}: {
  form: FormState
  onFinish: () => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-6 text-center">
      <div className="space-y-3">
        <div className="text-7xl animate-float mb-2">🐦</div>
        <h2 className="text-2xl font-bold text-nido-dusk">
          ¡Hola, {form.name}!
        </h2>
        <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/80 p-5 text-left">
          <p className="text-sm font-semibold text-nido-dusk">Gorrión del Amanecer</p>
          <p className="text-xs text-nido-sage italic mb-2">Passer aureus · Común</p>
          <p className="text-sm text-nido-dusk/70 leading-relaxed">
            "Dicen que este gorrión aparece cada vez que alguien toma una decisión valiente.
            Llegó el día que decidiste cuidarte."
          </p>
        </div>
        <p className="text-nido-dusk/60 text-sm">
          Tu primer compañero ya está en tu nido, esperándote.
          Cada día sin fumar traerá más aves.
        </p>
      </div>

      <Button size="xl" className="w-full" onClick={onFinish}>
        Ir a mi Nido 🪺
      </Button>
    </div>
  )
}

function NavButtons({
  onBack, onNext, disabled,
}: {
  onBack: () => void
  onNext: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex gap-3">
      <Button variant="ghost" size="md" onClick={onBack} className="flex-shrink-0">
        ←
      </Button>
      <Button size="lg" className="flex-1" onClick={onNext} disabled={disabled}>
        Continuar →
      </Button>
    </div>
  )
}
