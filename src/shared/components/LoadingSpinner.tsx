interface LoadingSpinnerProps {
    message?: string
  }
  
  export default function LoadingSpinner({ message = 'Cargando...' }: LoadingSpinnerProps) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-secondary mt-3">{message}</p>
      </div>
    )
  }