import { Texture } from 'substance-texture'
import { SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID } from './FigurePackageConstants'
import Figure from './nodes/Figure'
import FigurePanel from './nodes/FigurePanel'
import MetadataField from './nodes/MetadataField'
import FigureConverter from './converters/FigureConverter'
import FigurePanelConverter from './converters/FigurePanelConverter'
import FigurePackageJATSImporter from './converters/FigurePackageJATSImporter'
import FigurePackageJATSExporter from './converters/FigurePackageJATSExporter'
import FigurePackageEditor from './components/FigurePackageEditor'
import FigurePackageLabelGenerator from './FigurePackageLabelGenerator'
import InsertFigurePanelCommand from './commands/InsertFigurePanelCommand'
import FigurePackageToolbar from './FigurePackageToolbar'
import FigurePanelManager from './FigurePanelManager'
import RemoveFigurePanelCommand from './commands/RemoveFigurePanelCommand'
import { MoveFigurePanelCommand } from './commands/MoveFigurePanelCommand'
import { ReplaceFigurePanelImageCommand } from './commands/ReplaceFigurePanelImageCommand'

Texture.registerPlugin({
  name: 'source-data-plugin',
  configure (configurator) {
    const articleConfig = configurator.getConfiguration('article')

    // let Texture know about a JATS customization used by this plugin
    articleConfig.registerSchemaId(SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID)

    articleConfig.addNode(Figure, { force: true })
    articleConfig.addNode(FigurePanel, { force: true })
    articleConfig.addNode(MetadataField, { force: true })

    articleConfig.addConverter(SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, FigureConverter)
    articleConfig.addConverter(SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, FigurePanelConverter)

    articleConfig.addImporter(SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, FigurePackageJATSImporter, {
      converterGroups: [SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, 'jats']
    })
    // register a factory for an exporter
    articleConfig.addExporter(SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, FigurePackageJATSExporter, {
      converterGroups: [SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, 'jats']
    })

    articleConfig.addComponent('article-editor', FigurePackageEditor, { force: true })

    // ATTENTION: this changes Texture's figure label generation. Be aware to do
    // this only in the FigurePackage scenario, with only one figure
    articleConfig.setValue('figure-label-generator', new FigurePackageLabelGenerator())
    articleConfig.addService('figure-panel-manager', FigurePanelManager.create)

    articleConfig.addCommand('insert-figure-panel', InsertFigurePanelCommand)
    articleConfig.addCommand('remove-figure-panel', RemoveFigurePanelCommand)
    articleConfig.addCommand('replace-figure-panel-image', ReplaceFigurePanelImageCommand)
    articleConfig.addCommand('move-figure-panel-up', MoveFigurePanelCommand, { direction: 'up' })
    articleConfig.addCommand('move-figure-panel-down', MoveFigurePanelCommand, { direction: 'down' })

    articleConfig.import(FigurePackageToolbar)
  }
})
