import './Flow.css'

interface FlowStepProps {
  label: string
  value: string
  valueColor?: string
  caption: string
  dotVariant: 'filled-dark' | 'filled-accent' | 'outline'
  active?: boolean
}

function FlowStep({ label, value, valueColor, caption, dotVariant, active }: FlowStepProps) {
  const dotClassName = `flow-step__dot flow-step__dot--${
    dotVariant === 'outline' ? 'outline' : dotVariant === 'filled-accent' ? 'accent' : 'dark'
  }`

  return (
    <div className={`flow-step${active ? ' flow-step--active' : ''}`}>
      <div className="flow-step__header">
        <span className={dotClassName} />
        <span className="flow-step__label">{label}</span>
      </div>
      <span className="flow-step__value" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </span>
      <span className="flow-step__caption">{caption}</span>
    </div>
  )
}

export default FlowStep
