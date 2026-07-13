import './Simulation.css'

interface SimulationStepProps {
  label: string
  value: string
  valueColor?: string
  caption: string
  dotVariant: 'filled-dark' | 'filled-accent' | 'outline'
  active?: boolean
}

function SimulationStep({ label, value, valueColor, caption, dotVariant, active }: SimulationStepProps) {
  const dotClassName = `simulation-step__dot simulation-step__dot--${
    dotVariant === 'outline' ? 'outline' : dotVariant === 'filled-accent' ? 'accent' : 'dark'
  }`

  return (
    <div className={`simulation-step${active ? ' simulation-step--active' : ''}`}>
      <div className="simulation-step__header">
        <span className={dotClassName} />
        <span className="simulation-step__label">{label}</span>
      </div>
      <span className="simulation-step__value" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </span>
      <span className="simulation-step__caption">{caption}</span>
    </div>
  )
}

export { SimulationStep }
