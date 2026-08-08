import type { ServiceStatus } from '../types/studio';

export function ServicePill({ name, status }: { name: string; status: ServiceStatus }) {
  return (
    <div className={`service-pill service-${status.state}`} title={status.detail}>
      <span className="service-dot" aria-hidden="true" />
      <span>{name}</span>
      <strong>{status.label}</strong>
    </div>
  );
}
