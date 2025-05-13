
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
  
  // Company logo
  const logoHTML = branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${sanitize(personalInfo.company)} logo" style="max-height: 60px; max-width: 180px; margin-bottom: 10px;">` : '';
  
  // Profile photo
  const photoHTML = personalInfo.photoUrl ? 
    `<img src="${personalInfo.photoUrl}" alt="${sanitize(personalInfo.name)}" style="border-radius: 50%; width: 80px; height: 80px; object-fit: cover; ${settings.imagePosition === 'none' ? 'display: none;' : ''}">` : '';
  
  // CTA button
  const ctaHTML = cta.text && cta.url ? `
    <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: ${cta.color}; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-top: 10px; font-family: ${branding.font || 'Arial, sans-serif'};">
      ${sanitize(cta.text)}
    </a>
  ` : '';

  // Different layouts based on settings
  let templateHTML = '';
  
  switch (settings.layout) {
    case 'modern':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #333333;">
          <tr>
            <td style="padding-bottom: 15px;" colspan="2">
              ${logoHTML}
            </td>
          </tr>
          <tr>
            ${settings.imagePosition !== 'none' && settings.imagePosition !== 'top' ? 
              `<td style="padding-right: 15px; vertical-align: middle; ${settings.imagePosition === 'right' ? 'padding-left: 15px; padding-right: 0;' : ''}">
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
              <div>${ctaHTML}</div>
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
                <div>${ctaHTML}</div>
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
                ${personalInfo.website ? `<div><a href="${sanitizeUrl(personalInfo.website)}" style="color: white; text-decoration: none;">${sanitize(personalInfo.website)}</a></div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 10px 0; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
              <div style="margin-top: 15px;">
                ${cta.text && cta.url ? `
                <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: white; color: ${branding.primaryColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-family: ${branding.font || 'Arial, sans-serif'}; font-weight: bold;">
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
              <div style="font-size: 12px; margin-bottom: 10px; color: #33475b;">
                ${personalInfo.email ? `<span style="margin-right: 10px;"><a href="mailto:${personalInfo.email}" style="color: #ff7a59; text-decoration: none;">${sanitize(personalInfo.email)}</a></span>` : ''}
                ${personalInfo.phone ? `<span><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: #ff7a59; text-decoration: none;">${sanitize(personalInfo.phone)}</a></span>` : ''}
              </div>
              <div style="margin-top: 10px; display: flex; align-items: center;">
                <div>${ctaHTML.replace('background-color', 'background-color: #ff7a59;').replace('margin-top: 10px;', '')}</div>
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
                      ${cta.text && cta.url ? `
                      <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: ${cta.color}; color: white; padding: 4px 10px; text-decoration: none; border-radius: 4px; font-family: ${branding.font || 'Arial, sans-serif'}; font-size: 12px;">
                        ${sanitize(cta.text)}
                      </a>` : ''}
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
              <div>${ctaHTML}</div>
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
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      ${templateHTML}
    </div>
  `;
};

// Generate social media icons based on style
const generateSocialIconsHTML = (
  socialLinks: Record<string, string | undefined>,
  style: string
): string => {
  if (!socialLinks || Object.keys(socialLinks).filter(key => socialLinks[key]).length === 0) {
    return '';
  }
  
  const icons: Record<string, string> = {
    linkedin: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg',
    twitter: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg',
    facebook: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg',
    instagram: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg'
  };
  
  const colors: Record<string, string> = {
    linkedin: '#0077B5',
    twitter: '#1DA1F2',
    facebook: '#1877F2',
    instagram: '#E4405F'
  };
  
  let iconsHTML = '';
  
  for (const [platform, url] of Object.entries(socialLinks)) {
    if (!url || !icons[platform]) continue;
    
    let backgroundColor = 'transparent';
    let iconColor = '#000000';
    let padding = '0';
    let borderRadius = '0';
    
    switch (style) {
      case 'color':
        iconColor = colors[platform] || '#000000';
        break;
      case 'monochrome':
        iconColor = '#555555';
        break;
      case 'circle':
        backgroundColor = colors[platform] || '#000000';
        iconColor = '#FFFFFF';
        padding = '5px';
        borderRadius = '50%';
        break;
      case 'square':
        backgroundColor = colors[platform] || '#000000';
        iconColor = '#FFFFFF';
        padding = '5px';
        borderRadius = '4px';
        break;
    }
    
    const sanitizedUrl = sanitizeUrl(url);
    
    iconsHTML += `
      <a href="${sanitizedUrl}" style="display: inline-block; margin-right: 8px; text-decoration: none;" target="_blank">
        <span style="display: inline-flex; align-items: center; justify-content: center; background-color: ${backgroundColor}; border-radius: ${borderRadius}; padding: ${padding};">
          <img src="${icons[platform]}" alt="${platform}" style="height: 16px; width: 16px; filter: ${style !== 'color' && style !== 'monochrome' ? 'brightness(0) invert(1)' : `invert(0.3)`};">
        </span>
      </a>
    `;
  }
  
  return iconsHTML;
};
