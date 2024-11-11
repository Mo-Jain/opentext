import { Router} from "express";
import { middleware } from "../../middleware";
import client from "@repo/db/client";
import { deleteFolderSchema, createFolderSchema, updateFolderSchema } from "../../types";
import { formatItem } from ".";

export const folderRouter = Router();   


folderRouter.post("/", middleware, async (req, res) => {
    const parsedData = createFolderSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong folder input format"})
        return
    }

    try {
        const parentFolder = await client.folder.findFirst({
            where: {
                id: parsedData.data.parentFolderId,
            }
        });

        if(parentFolder?.creatorId != req.userId){
            res.status(403).json({message: "Not Authorized to create"})
            return
        }
    
        await client.folder.create({
            data: {
                name: parsedData.data.name,
                creatorId: req.userId!,
                parentFolderId: parsedData.data.parentFolderId,
                path: parentFolder?.path + "/" + parentFolder?.name
            }
        })

        res.json({
            message: "Folders created"
        })
    } catch(e) {    
        res.status(400).json({message: "Folder not found"})
    }
})

folderRouter.get("/:folderId", middleware, async (req, res) => {
    const folder = await client.folder.findFirst({
        where: {
            id: req.params.folderId
        },
        include: {
            subfolders: {
                include: {
                    subfolders: true,
                    files: true
                }
            }
        }
    })
    if (!folder) {
        res.status(404).json({ message: "Folder not found" });
        return;
    }
    const folderData = folder.subfolders.map((folder:any) => formatItem(folder, true));
    res.json({
        folderData
    })
})


folderRouter.put("/:folderId", middleware, async (req, res) => {
    const parsedData = updateFolderSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong folder input format"})
        return
    }

    try {
        const folder = await client.folder.findFirst({
            where: {
                id: req.params.folderId
            }
        });

        if(folder?.creatorId != req.userId){
            res.status(403).json({message: "Not Authorized to update"})
            return
        }

        await client.folder.update({
            where: {
                id: req.params.folderId
            }, 
            data: {
                name: parsedData.data.name,
                isFavorite: parsedData.data.isFavorite ?? folder?.isFavorite
            }
        })

        res.json({message: "Folder updated successfully"})
    } catch(e) {    
        res.status(400).json({message: "Folder not found"})
    }
})

folderRouter.delete("/:id", middleware, async (req, res, next) => {
    const parsedData = deleteFolderSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong folder input format"})
        return  
    }

    try {
        const folder = await client.folder.findFirst({
            where: {
                id: parsedData.data.id
            }
        })
        if(folder?.creatorId != req.userId){
            res.status(403).json({message: "Not Authorized to delete"})
            return
        }
        await client.folder.delete({
            where: {
                id: parsedData.data.id
            }
        })
        
        res.json({message: "Folder deleted successfully"})  
    }
    catch(e) {  
        res.status(400).json({message: "Folder not found"})
    }
})

