
import { SignatureData } from "./signatureStorage";

// Helper to sanitize URLs
const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Add http:// if missing
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

// Helper to sanitize user inputs
const sanitize = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

export const generateSignatureHTML = (signature: SignatureData): string => {
  const { personalInfo, socialLinks, branding, cta, settings } = signature.data;
  
  // Generate social icons
  const socialIconsHTML = generateSocialIconsHTML(socialLinks, settings.socialIconStyle);
  
  // Use either new or old property names for backward compatibility
  const logoUrl = branding.logoUrl || branding.logo;
  const primaryColor = branding.brandColor || branding.primaryColor;
  const secondaryColor = branding.textColor || branding.secondaryColor;
  const fontFamily = branding.fontFamily || branding.font;
  const buttonColor = cta.buttonColor || cta.color;
  const ctaTextColor = cta.textColor || '#ffffff';
  
  // Company logo - ensure it's properly formatted for email clients
  const logoHTML = logoUrl ? `
    <div style="margin-bottom: 10px;">
      <img src="${logoUrl}" alt="${sanitize(personalInfo.company)} logo" style="display: block; max-height: 60px; max-width: 180px; height: auto; width: auto;" border="0">
    </div>
  ` : '';
  
  // Profile photo
  const photoHTML = personalInfo.photoUrl ? 
    `<img src="${personalInfo.photoUrl}" alt="${sanitize(personalInfo.name)}" style="display: block; border-radius: 50%; width: 80px; height: 80px; object-fit: cover; ${settings.imagePosition === 'none' ? 'display: none;' : ''}" border="0">` : '';
  
  // CTA button
  const ctaHTML = cta.text && cta.url ? `
    <div style="margin-top: 10px;">
      <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: ${buttonColor}; color: ${ctaTextColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-family: ${fontFamily}; border: none;">
        ${sanitize(cta.text)}
      </a>
    </div>
  ` : '';

  // Different layouts based on settings
  let templateHTML = '';
  
  switch (settings.layout) {
    case 'modern':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #333333;">
          ${logoHTML ? `<tr><td style="padding-bottom: 15px;" colspan="2">${logoHTML}</td></tr>` : ''}
          <tr>
            ${settings.imagePosition !== 'none' && settings.imagePosition !== 'top' && settings.imagePosition !== 'right' ? 
              `<td style="padding-right: 15px; vertical-align: middle;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="text-align: center; margin-bottom: 15px;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 18px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 10px; color: ${branding.secondaryColor || '#666'};">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}</span>
              </div>
              <div style="font-size: 12px; margin-bottom: 10px; color: #666;">
                ${personalInfo.email ? `<div>Email: <a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div>Phone: <a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                ${personalInfo.website ? `<div>Website: <a href="${sanitizeUrl(personalInfo.website)}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.website)}</a></div>` : ''}
                ${personalInfo.address ? `<div>${sanitize(personalInfo.address)}</div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 10px 0; color: #555; font-size: 13px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              ${ctaHTML}
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 15px; vertical-align: middle;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'minimal':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 400px; color: #333333;">
          <tr>
            <td>
              <div style="border-left: 3px solid ${branding.primaryColor}; padding-left: 10px;">
                <div style="margin-bottom: 5px;">
                  <span style="font-weight: bold; font-size: 16px;">${sanitize(personalInfo.name)}</span>
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                  ${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}
                </div>
                <div style="font-size: 12px; margin-bottom: 8px;">
                  ${personalInfo.email ? `<span style="margin-right: 10px;"><a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></span>` : ''}
                  ${personalInfo.phone ? `<span><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></span>` : ''}
                </div>
                ${personalInfo.tagline ? `<div style="font-style: italic; margin: 6px 0; color: #555; font-size: 12px;">${sanitize(personalInfo.tagline)}</div>` : ''}
                <div style="margin-top: 10px;">${socialIconsHTML}</div>
                ${ctaHTML}
              </div>
            </td>
          </tr>
        </table>
      `;
      break;
    case 'bold':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 550px; color: white; background-color: ${branding.primaryColor}; padding: 20px; border-radius: 10px;">
          <tr>
            ${settings.imagePosition === 'left' ? 
              `<td style="padding-right: 20px; vertical-align: middle; width: 80px;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="margin-bottom: 15px; text-align: center;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 22px;">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 15px; opacity: 0.9;">
                <span style="font-size: 16px;">${sanitize(personalInfo.title)}</span>
                ${personalInfo.company ? `<br><span style="font-size: 14px;">${sanitize(personalInfo.company)}</span>` : ''}
              </div>
              <div style="font-size: 13px; margin-bottom: 15px;">
                ${personalInfo.email ? `<div><a href="mailto:${personalInfo.email}" style="color: white; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: white; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 10px 0; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
              <div style="margin-top: 15px;">
                ${cta.text && cta.url ? `
                <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: white; color: ${branding.primaryColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-family: ${branding.font || 'Arial, sans-serif'}; font-weight: bold; border: none;">
                  ${sanitize(cta.text)}
                </a>` : ''}
              </div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 20px; vertical-align: middle; width: 80px;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'hubspot':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #33475b; border: 1px solid #e5e7eb;">
          <tr>
            ${settings.imagePosition !== 'none' && settings.imagePosition !== 'top' && settings.imagePosition !== 'right' ? 
              `<td style="width: 30%; padding: 15px; vertical-align: middle; border-right: 1px solid #e5e7eb; text-align: center;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top; padding: 15px; ${settings.imagePosition === 'none' ? 'width: 100%;' : ''}">
              ${settings.imagePosition === 'top' ? `<div style="text-align: center; margin-bottom: 15px;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 16px; color: #ff7a59;">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 10px; color: #33475b;">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}</span>
              </div>
              <div style="font-size: 12px; margin-bottom: 10px;">
                ${personalInfo.email ? `<span style="margin-right: 10px;"><a href="mailto:${personalInfo.email}" style="color: #ff7a59; text-decoration: none;">${sanitize(personalInfo.email)}</a></span>` : ''}
                ${personalInfo.phone ? `<span><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: #ff7a59; text-decoration: none;">${sanitize(personalInfo.phone)}</a></span>` : ''}
              </div>
              <div style="margin-top: 10px; display: flex; align-items: center;">
                <div>${ctaHTML.replace('margin-top: 10px;', '')}</div>
                <div style="margin-left: 10px;">${socialIconsHTML}</div>
              </div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="width: 30%; padding: 15px; vertical-align: middle; border-left: 1px solid #e5e7eb; text-align: center;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'compact':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 400px; color: #333333;">
          <tr>
            <td>
              <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                  <tr>
                    <td style="width: 50%;">
                      <span style="font-weight: bold; font-size: 14px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
                    </td>
                    <td style="width: 50%; text-align: right;">
                      ${ctaHTML.replace('margin-top: 10px;', '')}
                    </td>
                  </tr>
                </table>
              </div>
              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td style="width: 70%; font-size: 12px;">
                    ${personalInfo.email ? `<div><a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                    ${personalInfo.phone ? `<div><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                  </td>
                  <td style="width: 30%; text-align: right;">
                    ${socialIconsHTML}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
      break;
    case 'standard':
    default:
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #333333;">
          ${logoHTML ? `<tr><td colspan="3" style="padding-bottom: 10px;">${logoHTML}</td></tr>` : ''}
          <tr>
            ${settings.imagePosition === 'left' ? 
              `<td style="padding-right: 15px; vertical-align: top; width: 80px;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="margin-bottom: 10px; text-align: center;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 16px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 5px; color: ${branding.secondaryColor || '#666'};">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}</span>
                ${personalInfo.company ? `<br><span style="font-size: 14px;">${sanitize(personalInfo.company)}</span>` : ''}
              </div>
              <div style="font-size: 12px; margin-bottom: 10px;">
                ${personalInfo.email ? `<div>Email: <a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div>Phone: <a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                ${personalInfo.website ? `<div>Website: <a href="${sanitizeUrl(personalInfo.website)}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.website)}</a></div>` : ''}
                ${personalInfo.address ? `<div>Address: ${sanitize(personalInfo.address)}</div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 8px 0; color: #555; font-size: 13px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              ${ctaHTML}
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 15px; vertical-align: top; width: 80px;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
  }
  
  return templateHTML;
};

// Generate social media icons using simple Unicode symbols and text - Email-safe version
const generateSocialIconsHTML = (
  socialLinks: Record<string, string | undefined>,
  style: string
): string => {
  if (!socialLinks || Object.keys(socialLinks).filter(key => socialLinks[key]).length === 0) {
    return '';
  }

  // Use simple Unicode symbols that work across all email clients
  const iconData: Record<string, { symbol: string, color: string, name: string }> = {
    linkedin: {
      symbol: 'in',
      color: '#0077B5',
      name: 'LinkedIn'
    },
    twitter: {
      symbol: 'tw',
      color: '#1DA1F2',
      name: 'Twitter'
    },
    facebook: {
      symbol: 'fb',
      color: '#1877F2',
      name: 'Facebook'
    },
    instagram: {
      symbol: 'ig',
      color: '#E4405F',
      name: 'Instagram'
    },
    github: {
      symbol: 'gh',
      color: '#181717',
      name: 'GitHub'
    },
    behance: {
      symbol: 'be',
      color: '#0070BB',
      name: 'Behance'
    }
  };

  const iconSize = 20;
  const iconSpacing = 8;

  let icons = '';
  
  Object.entries(socialLinks).forEach(([platform, url]) => {
    if (!url) return;
    
    const iconInfo = iconData[platform as keyof typeof iconData];
    if (!iconInfo) return;
    
    const sanitizedUrl = sanitizeUrl(url);
    const bgColor = (style === 'circle' || style === 'square') ? iconInfo.color : 'transparent';
    const borderRadius = style === 'circle' ? '50%' : style === 'square' ? '4px' : '0';
    const padding = (style === 'circle' || style === 'square') ? '4px' : '0';
    const textColor = (style === 'circle' || style === 'square') ? 'white' : iconInfo.color;
    
    icons += `
      <a href="${sanitizedUrl}" style="display: inline-block; margin-right: ${iconSpacing}px; text-decoration: none;" target="_blank" rel="noopener noreferrer">
        <span style="
          background-color: ${bgColor}; 
          color: ${textColor}; 
          border-radius: ${borderRadius}; 
          padding: ${padding}; 
          display: inline-block; 
          width: ${iconSize}px; 
          height: ${iconSize}px; 
          text-align: center; 
          line-height: ${iconSize}px; 
          font-size: 10px; 
          font-weight: bold; 
          font-family: Arial, sans-serif;
          text-transform: uppercase;
        " title="${iconInfo.name}">
          ${iconInfo.symbol}
        </span>
      </a>
    `;
  });

  return icons;
};
