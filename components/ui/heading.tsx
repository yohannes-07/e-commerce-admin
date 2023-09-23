interface HeadingProps {
    title:string,
    description:string
};

export const Heading:React.FC<HeadingProps> = ({
    title,
    description
}) => {
  return (
    <div>
        <h2 className="text-3xl font-bold tracking-wide">{title}</h2>
        <p className="text-sm text-muted-forgeround">{description}</p>
    </div>
  )
}

