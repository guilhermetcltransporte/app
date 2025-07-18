import { readFile } from 'fs/promises'
import { join } from 'path'
import { parseStringPromise } from 'xml2js'

// MUI Imports
import Button from '@mui/material/Button'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import Customizer from '@core/components/customizer'
import ScrollToTop from '@core/components/scroll-to-top'
import AuthGuard from '@/hocs/AuthGuard'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import RouteProgressBar from '@/components/RouteProgressBar'
import { TitleProvider } from '@/contexts/TitleProvider'

const Layout = async ({ children }) => {
  const direction = i18n.langDirection[i18n.defaultLocale]
  const dictionary = await getDictionary(i18n.defaultLocale)
  const mode = await getMode()
  const systemMode = await getSystemMode()

  // Lê e converte o sitemap
  const sitemapPath = join(process.cwd(), 'sitemap.xml')
  let sitemapJson = null

  try {
    const xml = await readFile(sitemapPath, 'utf8')
    const xmlNormalized = xml.replace(/\$\{URL\}/g, 'https://global.tcltransporte.com.br').replace(/\\/g, '/')
    sitemapJson = await parseStringPromise(xmlNormalized)
  } catch (err) {
    console.error('Erro ao carregar sitemap:', err)
  }

  return (
    <Providers direction={direction}>
      <RouteProgressBar />

      <AuthGuard locale={i18n.defaultLocale}>
        <TitleProvider>
          <LayoutWrapper
            systemMode={systemMode}
            verticalLayout={
              <VerticalLayout
                navigation={<Navigation dictionary={dictionary} mode={mode} siteMap={sitemapJson} />}
                navbar={<Navbar />}
                // footer={<VerticalFooter />}
              >
                {children}
              </VerticalLayout>
            }
            horizontalLayout={
              <HorizontalLayout
                header={<Header dictionary={dictionary} />}
                // footer={<HorizontalFooter />}
              >
                {children}
              </HorizontalLayout>
            }
          />
          <ScrollToTop className='mui-fixed'>
            <Button
              variant='contained'
              className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
            >
              <i className='ri-arrow-up-line' />
            </Button>
          </ScrollToTop>
          <Customizer dir={direction} />
        </TitleProvider>
      </AuthGuard>
    </Providers>
  )
}

export default Layout
