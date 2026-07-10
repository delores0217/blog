import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import CONFIG from '../config'

const getCurrentSearchQuery = router => {
  const queryString = router?.asPath?.split('?')[1]?.split('#')[0] || ''
  const params = new URLSearchParams(queryString)
  const query = {}
  params.forEach((value, key) => {
    query[key] = value
  })
  return query
}

const getArchiveHref = (publishDay, router) => {
  const query = getCurrentSearchQuery(router)
  if (!publishDay) return { pathname: '/archive', query }
  const str = String(publishDay)
  const matched = str.match(/^(\d{4})[-/.](\d{1,2})/)
  if (!matched) return { pathname: '/archive', query }
  const year = matched[1]
  const month = matched[2].padStart(2, '0')
  return {
    pathname: '/archive',
    query,
    hash: `archive-${year}-${month}`
  }
}

const ArticleHeader = ({ post }) => {
  const router = useRouter()
  const { locale } = useGlobal()
  if (!post) return null

  const wordCount = post.wordCount || post.words || 0
  const readTime = post.readTime || (wordCount ? Math.max(1, Math.round(wordCount / 275)) : 0)
  const showReading =
    siteConfig('FUWARI_ARTICLE_READING_TIME', true, CONFIG) && wordCount > 0

  return (
    <header className='mb-6'>
      <h1 className='text-3xl lg:text-4xl font-bold mb-3 leading-tight'>{post.title}</h1>
      {siteConfig('FUWARI_ARTICLE_META', true, CONFIG) && (
        <div className='text-sm text-[var(--fuwari-muted)] flex flex-wrap items-center gap-2'>
          <SmartLink href={getArchiveHref(post.publishDay, router)} className='fuwari-link'>{post.publishDay}</SmartLink>

          {post.category && (
            <>
              <span>·</span>
              <SmartLink href={`/category/${encodeURIComponent(post.category)}`} className='fuwari-link'>
                {post.category}
              </SmartLink>
            </>
          )}
          {!!post.tagItems?.length && (
            <>
              <span>·</span>
              {post.tagItems.slice(0, 4).map((tag, idx) => (
                <SmartLink
                  key={tag.name}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  className='fuwari-link'>
                  {idx > 0 ? ` / #${tag.name}` : `#${tag.name}`}
                </SmartLink>
              ))}
            </>
          )}
          {showReading && (
            <>
              <span>·</span>
              <span className='inline-flex items-center gap-1'>
                <i className='far fa-clock' aria-hidden='true' />
                {readTime} {locale?.COMMON?.MINUTE || 'min'}
              </span>
              <span>·</span>
              <span className='inline-flex items-center gap-1'>
                <i className='far fa-file-lines' aria-hidden='true' />
                {wordCount.toLocaleString()} {locale?.COMMON?.WORD_COUNT || '字'}
              </span>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default ArticleHeader

