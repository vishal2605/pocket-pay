

interface InputBox {
    label:string,
    placeholder:string,
    name:string,
    onChange
}

export const Header = ({
    label
}: InputBox) => {
    return (
        <div className="flex flex-col py-2 font-medium">
      {label}
      <input
        type="text"
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        id={id}
        required
        className="h-10 rounded border-2 border-gray-100 p-2"
      />
    </div>
    )
}