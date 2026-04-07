"use client"

interface StatusScreenProps {
  message: string
}

export default function StatusScreen({ message }: StatusScreenProps) {
  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-body-tertiary text-secondary small fw-medium">
      {message}
    </div>
  )
}
