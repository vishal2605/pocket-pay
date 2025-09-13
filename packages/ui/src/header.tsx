

interface Header {
    label:string
}

export const Header = ({
    label
}: Header) => {
    return <div>
    <div className="text-4xl font-bold text-center p-1">{label}</div>
  </div>
}