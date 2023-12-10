import React from 'react'
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, TextField, 
    FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Session } from '../stores/types'
import { useTranslation } from 'react-i18next'

const { useEffect } = React

const models: string[] = ['gpt-3.5-turbo', 'gpt-3.5-turbo-1106', 'gpt-3.5-burbo-16k',
    'gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-4-1106-preview', 'gpt-4-0613', 'gpr-4-vision-preview']

interface Props {
    open: boolean
    session: Session
    save(session: Session): void
    close(): void
}

export default function ChatConfigDialog(props: Props) {
    const { t } = useTranslation()
    const [dataEdit, setDataEdit] = React.useState<Session>(props.session)

    useEffect(() => {
        setDataEdit(props.session)
    }, [props.session])

    const onCancel = () => {
        props.close()
        setDataEdit(props.session)
    }

    const onSave = () => {
        if (dataEdit.name === '') {
            dataEdit.name = props.session.name
        }
        dataEdit.name = dataEdit.name.trim()
        props.save(dataEdit)
        props.close()
    }

    return (
        <Dialog open={props.open} onClose={onCancel}>
            <DialogTitle>Conversation Settings</DialogTitle>
            <DialogContent>
                <DialogContentText></DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('name')}
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={dataEdit.name}
                    onChange={(e) => setDataEdit({ ...dataEdit, name: e.target.value })}
                />
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel htmlFor="model-select">{t('model')}</InputLabel>
                    <Select
                        label="Model"
                        id="model-select"
                        value={dataEdit.settings?.model || 'gpt-3.5-turbo'}
                        onChange={(e) => {
                            if (dataEdit.settings) {
                                dataEdit.settings.model = e.target.value
                            } else {
                                dataEdit.settings = {
                                    model: e.target.value,
                                    temperature: 0.7,
                                    maxContextSize: '4000',
                                    maxTokens: '2048',
                                }
                            }
                            setDataEdit(dataEdit)
                    }}
                    >
                        {models.map((model) => (
                            <MenuItem key={model} value={model}>
                                {model}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{t('cancel')}</Button>
                <Button onClick={onSave}>{t('save')}</Button>
            </DialogActions>
        </Dialog>
    )
}
