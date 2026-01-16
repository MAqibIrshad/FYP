import {Ban} from 'lucid-react'
import { buttonVariants } from '../ui/button'
interface iAppProps {
    title: string,
    buttonText: string,
    description: string,
    href: string,
}
export default function EmptyState({title, buttonText, description, href}: iAppProps){
    return(
    
            <div className={"flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in-50"}>
                <div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
                <Ban className={"size-10 text-primary"}>

                </Ban>
                </div>
                <h2 className="mt-6 text-xl font-semibold">{title}</h2>
                <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-background">{description}</p>
                <Link href={href} className={buttonVariants()}>
                    <PlusCircle className="size-4 mr-2" />
                        {buttonText}
                </Link>
            </div>
    
    )
}
