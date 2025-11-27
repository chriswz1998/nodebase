'use client'

import {memo, useState} from "react";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {NodeSelector} from "@/components/node-selector";

export const AddNodeButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false)

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <Button
                className={'bg-background'}
                size={"icon"}
                variant={"outline"}
                onClick={() => {}}
            >
                <PlusIcon/>
            </Button>
        </NodeSelector>
    )
})

AddNodeButton.displayName = "AddNodeButton";