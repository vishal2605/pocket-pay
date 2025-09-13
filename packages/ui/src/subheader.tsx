

interface SubHeader {
    label:string
}

export const SubHeader = ({
    label
}: SubHeader) => {
    return<div>
    <div className="text-gray-600 text-lg pt-1 px-4 pb-4 text-center max-w-[350px]">
      {label}
    </div>
  </div>
}