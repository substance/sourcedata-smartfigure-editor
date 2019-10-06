import { Texture } from 'substance-texture'
import { SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID } from './FigurePackageConstants'
import FigurePackageJATSImporter from './FigurePackageJATSImporter'
import FigurePackageJATSExporter from './FigurePackageJATSExporter'

// nodes

// converters

// commands

// components

// services

Texture.registerPlugin({
  name: 'source-data-plugin',
  configure (configurator) {
    let articleConfig = configurator.getConfiguration('article')

    // let Texture know about a JATS customization used by this plugin
    articleConfig.registerSchemaId(SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID)

    articleConfig.addImporter(SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, FigurePackageJATSImporter, {
      converterGroups: ['jats', SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID]
    })
    // register a factory for an exporter
    articleConfig.addExporter(SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, FigurePackageJATSExporter, {
      converterGroups: ['jats', SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID]
    })
  }
})
