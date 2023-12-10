import React from 'react'
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, TextField, 
    FormControl, InputLabel, Select, MenuItem, Chip, Box, Slider, Typography} from '@mui/material'
import { Session, Settings } from '../stores/types'
import { useTranslation } from 'react-i18next'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle'
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle'

const { useEffect } = React

const models: string[] = ['gpt-3.5-turbo', 'gpt-3.5-turbo-1106', 'gpt-3.5-burbo-16k',
    'gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-4-1106-preview', 'gpt-4-0613', 'gpr-4-vision-preview']

interface Props {
    open: boolean
    session: Session
    settings: Settings
    save(session: Session): void
    close(): void
}

export default function ChatConfigDialog(props: Props) {
    const { t } = useTranslation()
    const [dataEdit, setDataEdit] = React.useState<Session>(props.session)
    const [settingsEdit, setSettingsEdit] = React.useState<Settings>(props.settings)

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

    const getChatSettings = () => {
        if (dataEdit.settings) {
            return dataEdit.settings
        }
        return {
            model: settingsEdit.model,
            temperature: settingsEdit.temperature,
            maxContextSize: settingsEdit.maxContextSize,
            maxTokens: settingsEdit.maxTokens,
        }
    }

    const handleTemperatureChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        const value = typeof newValue === 'number' ? newValue : newValue[activeThumb]
        dataEdit.settings = {...getChatSettings(), temperature: value}
        setDataEdit(dataEdit)
    }

    const handleMaxContextSliderChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        const value = newValue === 8192 ? 'inf' : newValue.toString()
        dataEdit.settings = {...getChatSettings(), maxContextSize: value}
        setDataEdit(dataEdit)
    }

    const handleRepliesTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value != 'inf') {
            const numValue = Number(value)
            if (!isNaN(numValue) && numValue > 8192) {
                value = 'inf'
            }
        }
        dataEdit.settings = {...getChatSettings(), maxTokens: value}
        setDataEdit(dataEdit)
    }
    const handleMaxContextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value != 'inf') {
            const numValue = Number(value)
            if (!isNaN(numValue) && numValue > 8192) {
                value = 'inf'
            }
        }
        dataEdit.settings = {...getChatSettings(), maxContextSize: value}
        setDataEdit(dataEdit)
 
    }

    const handleRepliesTokensSliderChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        const value = newValue === 8192 ? 'inf': newValue.toString()
        dataEdit.settings = {...getChatSettings(), maxTokens: value}
        setDataEdit(dataEdit)
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
                        value={dataEdit.settings?.model || settingsEdit.model}
                        onChange={(e) => {
                            const currentSettings = getChatSettings()
                            dataEdit.settings = currentSettings
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
                
                <Box sx={{ marginTop: 3, marginBottom: 1 }}>
                            <Typography id="discrete-slider" gutterBottom>
                                {t('temperature')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <Box sx={{ width: '100%' }}>
                                <Slider
                                    value={settingsEdit.temperature}
                                    onChange={handleTemperatureChange}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    defaultValue={settingsEdit.temperature}
                                    step={0.1}
                                    min={0}
                                    max={1}
                                    marks={[
                                        {
                                            value: 0.2,
                                            label: (
                                                <Chip
                                                    size="small"
                                                    icon={<PlaylistAddCheckCircleIcon />}
                                                    label={t('meticulous')}
                                                />
                                            ),
                                        },
                                        {
                                            value: 0.8,
                                            label: (
                                                <Chip
                                                    size="small"
                                                    icon={<LightbulbCircleIcon />}
                                                    label={t('creative')}
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ marginTop: 3, marginBottom: -1 }}>
                            <Typography id="discrete-slider" gutterBottom>
                                {t('max tokens in context')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <Box sx={{ width: '92%' }}>
                                <Slider
                                    value={
                                        settingsEdit.maxContextSize === 'inf'
                                            ? 8192
                                            : Number(settingsEdit.maxContextSize)
                                    }
                                    onChange={handleMaxContextSliderChange}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    defaultValue={
                                        settingsEdit.maxContextSize === 'inf'
                                            ? 8192
                                            : Number(settingsEdit.maxContextSize)
                                    }
                                    step={64}
                                    min={64}
                                    max={8192}
                                />
                            </Box>
                            <TextField
                                sx={{ marginLeft: 2 }}
                                value={settingsEdit.maxContextSize}
                                onChange={handleMaxContextInputChange}
                                type="text"
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        <Box sx={{ marginTop: 3, marginBottom: -1 }}>
                            <Typography id="discrete-slider" gutterBottom>
                                {t('max tokens per reply')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <Box sx={{ width: '92%' }}>
                                <Slider
                                    value={settingsEdit.maxTokens === 'inf' ? 8192 : Number(settingsEdit.maxTokens)}
                                    defaultValue={
                                        settingsEdit.maxTokens === 'inf' ? 8192 : Number(settingsEdit.maxTokens)
                                    }
                                    onChange={handleRepliesTokensSliderChange}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={64}
                                    min={64}
                                    max={8192}
                                />
                            </Box>
                            <TextField
                                sx={{ marginLeft: 2 }}
                                value={settingsEdit.maxTokens}
                                onChange={handleRepliesTokensInputChange}
                                type="text"
                                size="small"
                                variant="outlined"
                            />
                        </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{t('cancel')}</Button>
                <Button onClick={onSave}>{t('save')}</Button>
            </DialogActions>
        </Dialog>
    )
}
